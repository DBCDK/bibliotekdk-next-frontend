/**
 * @file React hooks related to ordering via ILL or digital article service
 */

import { editionManifestations } from "@/lib/api/manifestation.fragments";
import { AccessEnum } from "@/lib/enums";
import { useEffect, useMemo } from "react";
import { useModal } from "../_modal";
import {
  setAlreadyOrdered,
  workHasAlreadyBeenOrdered,
} from "../_modal/pages/order/utils/order.utils";
import { useGlobalState } from "./useGlobalState";
import { useManifestationAccess } from "./useManifestationAccess";

import { useData, useMutate } from "@/lib/api/api";
import useAuthentication from "./user/useAuthentication";
import useLoanerInfo from "./user/useLoanerInfo";
import { extendedData } from "@/lib/api/user.fragments";
import { useBranchInfo } from "./useBranchInfo";
import { validateEmail } from "@/utils/validateEmail";
import { branchOrderPolicy } from "@/lib/api/branches.fragments";
import { useMany } from "./useMany";
import { LOGIN_MODE, openLoginModal } from "../_modal/pages/login/utils";
import * as orderMutations from "@/lib/api/order.mutations";
import isEqual from "lodash/isEqual";
import { getSessionStorageItem, setSessionStorageItem } from "@/lib/utils";

/**
 * Retrieves periodica information for a list of pids
 */
export function usePeriodica({ pids }) {
  // Fetch manifestation data for every pid
  const { data, isLoading } = useData(
    pids?.length > 0 &&
      editionManifestations({
        pid: pids,
      })
  );

  const workId = data?.manifestations?.[0]?.ownerWork?.workId;

  // Collect work types and material types for every manifestation
  const { workTypes, materialTypesSpecific } = useMemo(() => {
    const workTypes = {};
    const materialTypesSpecific = {};
    data?.manifestations?.forEach((m) => {
      m?.workTypes?.forEach(
        (workType) => (workTypes[workType?.toUpperCase()] = true)
      );
      m?.materialTypes?.forEach(
        (materialType) =>
          (materialTypesSpecific[
            materialType?.materialTypeSpecific?.code?.toUpperCase()
          ] = true)
      );
    });
    return { workTypes, materialTypesSpecific };
  }, [data]);

  // Based on the collected types, determine if pids belong to a periodica
  const isPeriodica =
    !!workTypes["PERIODICA"] || !!materialTypesSpecific["YEARBOOK"];

  return { isPeriodica, workId, isLoading };
}

/**
 * Determines whether the Interlibrary Loan (ILL) or Digital Article Service
 * should be used for ordering a list of PIDs .
 *
 * This function considers the order policy of the selected pickup branch
 * and also checks how the manifestations may be accessed.
 */
export function useOrderService({ pids }) {
  const { branchId, isLoading: pickupBranchIsLoading } = usePickupBranchId();
  const {
    digitalCopyPids,
    physicalCopyPids,
    isLoading: accessIsLoading,
  } = useManifestationAccess({
    pids: pids,
    filter: [AccessEnum.INTER_LIBRARY_LOAN, AccessEnum.DIGITAL_ARTICLE_SERVICE],
  });

  const policy = useOrderPolicy({
    branchId,
    pids,
  });
  const {
    isPeriodica,
    workId,
    isLoading: isLoadingPeriodica,
  } = usePeriodica({ pids });
  const { articleIsSpecified } = usePeriodicaForm(workId);

  let service = "NONE";
  let pidsToUse = [];
  if (
    digitalCopyPids?.length > 0 &&
    policy?.digitalCopyAllowed &&
    (!isPeriodica || (isPeriodica && articleIsSpecified))
  ) {
    service = "DIGITAL_ARTICLE";
    pidsToUse = digitalCopyPids;
  } else if (physicalCopyPids?.length > 0 && policy?.physicalCopyAllowed) {
    service = "ILL";
    pidsToUse = physicalCopyPids;
  }

  const isLoading =
    pickupBranchIsLoading ||
    accessIsLoading ||
    policy?.isLoading ||
    isLoadingPeriodica;

  return {
    service: !isLoading && service,
    pids: !isLoading && pidsToUse,
    isLoading,
  };
}

function useManifestationData({ pids }) {
  const { data, isLoading } = useData(
    pids?.length > 0 &&
      editionManifestations({
        pid: pids,
      })
  );

  const workId = data?.manifestations?.[0]?.ownerWork?.workId;
  const ownerWork = data?.manifestations?.[0]?.ownerWork;
  return { workId, ownerWork, manifestations: data?.manifestations, isLoading };
}

/**
 * Determines whether a work has already been ordered, allowing
 * the user to be warned and choose to accept or leave the order process.
 */
export function useShowAlreadyOrdered({ pids }) {
  const { data: manifestationsData, isLoading: manifestationIsLoading } =
    useData(
      pids?.length > 0 &&
        editionManifestations({
          pid: pids,
        })
    );

  const [orderCompleted] = useGlobalState({
    key: "orderCompleted",
    initial: false,
  });

  const workId = manifestationsData?.manifestations?.[0]?.ownerWork?.workId;

  const hasAlreadyBeenOrdered = useMemo(
    () => workHasAlreadyBeenOrdered(workId),
    [workId, orderCompleted]
  );

  const [acceptedAlreadyOrdered, setAcceptedAlreadyOrdered] = useGlobalState({
    key: `acceptedAlreadyOrdered:${workId}`,
    initial: false,
  });
  const isInOrderModal = useIsInOrderModal();

  // Reset acceptance, when user leaves order flow
  useEffect(() => {
    if (!isInOrderModal) {
      setAcceptedAlreadyOrdered(false);
    }
  }, [isInOrderModal]);

  return {
    workId,
    hasAlreadyBeenOrdered,
    acceptedAlreadyOrdered,
    setAcceptedAlreadyOrdered,
    showAlreadyOrderedWarning: hasAlreadyBeenOrdered && !acceptedAlreadyOrdered,
    isLoading: manifestationIsLoading,
  };
}

/**
 * Determines whether the order modal is active
 * Can be used to reset stuff, when user leaves the order
 * process.
 */
export function useIsInOrderModal() {
  const modal = useModal();

  const active = modal?.stack?.find((page) => page?.active);
  return ["multiorder", "ematerialfilter", "pickup"].includes(active?.id);
}

/**
 * A hook for storing and retrieving a periodicaForm, which must be used
 * when ordering a periodica or article within a periodica
 */
export function usePeriodicaForm(periodicaFormKey = "default") {
  const key = JSON.stringify(periodicaFormKey);
  const [periodicaForm, updatePeriodicaForm] = useGlobalState({
    key: `periodicaForm-${key}`,
    initial: null,
  });
  const [expanded, setExpanded] = useGlobalState({
    key: `periodicaForm-expanded-${key}`,
    initial: false,
  });

  const articleIsSpecified = !!(
    periodicaForm?.authorOfComponent ||
    periodicaForm?.titleOfComponent ||
    periodicaForm?.pagination
  );

  return {
    expanded,
    setExpanded,
    periodicaForm,
    articleIsSpecified,
    updatePeriodicaForm,
  };
}

/**
 * Returns the selected pickup branch
 */
export function usePickupBranchId() {
  const { hasCulrUniqueId, isLoading: authIsLoading } = useAuthentication();

  const { loanerInfo, isLoading: loanerInfoIsLoading } = useLoanerInfo();

  const { data: extendedUserData, isLoading: isLoadingExtendedData } = useData(
    hasCulrUniqueId && extendedData()
  );

  const isLoading =
    authIsLoading || loanerInfoIsLoading || isLoadingExtendedData;

  const branchId =
    loanerInfo?.pickupBranch ||
    extendedUserData?.user?.lastUsedPickUpBranch ||
    (
      loanerInfo?.municipalityAgencyId &&
      loanerInfo?.agencies?.find(
        (agency) => agency?.id === loanerInfo?.municipalityAgencyId
      )
    )?.id ||
    loanerInfo?.agencies?.[0]?.id;

  return {
    isLoading,
    branchId,
  };
}

function shouldRequirePincode(branch) {
  const isFFU = !!(branch?.agencyType === "FORSKNINGSBIBLIOTEK");
  const hasBorchk = branch?.borrowerCheck;
  const hasDataSync = branch?.culrDataSync;

  if (!isFFU || hasDataSync || (isFFU && !hasBorchk)) {
    return false;
  }

  return true;
}

/**
 * Hook for getting and setting pincode.
 * Pincode resets when user leaves order modal
 * It also checks if pickup branch requires pincode
 */
export function usePincode() {
  const { branchId, isLoadingBranchId } = usePickupBranchId();
  const {
    agencyType,
    borrowerCheck,
    culrDataSync,
    isLoading: isLoadingBranchInfo,
  } = useBranchInfo({ branchId });
  const [pincode, setPincode] = useGlobalState({ key: "pincode", initial: "" });
  const isInOrderModal = useIsInOrderModal();

  const isLoading = isLoadingBranchId || isLoadingBranchInfo;
  useEffect(() => {
    if (!isInOrderModal) {
      setPincode("");
    }
  }, [isInOrderModal]);

  const pincodeIsRequired = shouldRequirePincode({
    agencyType,
    borrowerCheck,
    culrDataSync,
  });

  return { pincode, setPincode, pincodeIsRequired, isLoading };
}

/**
 * Hook for getting and setting mail
 */
export function useMail() {
  const { loanerInfo, isLoading: isLoadingLoanerInfo } = useLoanerInfo();
  const { branchId, isLoadingBranchId } = usePickupBranchId();
  const { agencyId: pickupAgencyId, isLoading: isLoadingBranchInfo } =
    useBranchInfo({ branchId });

  const [mail, setMail] = useGlobalState({ key: "mail", initial: null });

  const mailFromPickupAgency = loanerInfo?.agencies?.find(
    (agency) => agency.id === pickupAgencyId
  )?.user?.mail;

  const mailFromSession = loanerInfo?.userParameters?.userMail;

  const isLoading =
    isLoadingBranchId || isLoadingBranchInfo || isLoadingLoanerInfo;

  const mailInUse =
    mail === null || typeof mail === "undefined"
      ? mailFromPickupAgency || mailFromSession
      : mail;
  const isValid = validateEmail(mailInUse);
  const message = !isValid && {
    context: "form",
    label: mailInUse ? "wrong-email-field" : "empty-email-field",
  };

  return {
    mail: mailInUse,
    setMail,
    mailFromPickupAgency,
    isValid,
    message,
    isLoading,
  };
}

/**
 * Detects if confirm order button was clicked.
 * Can be used to display error messages that should
 * only be visible after button was clicked
 */
export function useConfirmButtonClicked() {
  const [confirmButtonClicked, setConfirmButtonClicked] = useGlobalState({
    key: "confirmButtonClicked",
    initial: false,
  });

  return { confirmButtonClicked, setConfirmButtonClicked };
}

/**
 * Checks if order is valid and ready to be sent
 */
export function useOrderValidation({ pids }) {
  const {
    isPeriodica,
    workId,
    isLoading: isLoadingPeriodica,
  } = usePeriodica({ pids });
  const { branchId, isLoading: isLoadingPickupBranchId } = usePickupBranchId();
  const pickupBranch = useBranchInfo({ branchId });
  const { service: orderService, isLoading: isLoadingOrderService } =
    useOrderService({ pids });
  const { periodicaForm } = usePeriodicaForm(workId);
  const { mail, isValid: isValidMail, isLoading: isLoadingMail } = useMail();
  const {
    pincode,
    pincodeIsRequired,
    isLoading: isLoadingPincode,
  } = usePincode();
  const { showAlreadyOrderedWarning, isLoading: isLoadingAlreadyOrdered } =
    useShowAlreadyOrdered({ pids });

  const { confirmButtonClicked } = useConfirmButtonClicked();

  // Can only be validated when all data is loaded
  const isLoading =
    isLoadingPickupBranchId ||
    pickupBranch?.isLoading ||
    isLoadingOrderService ||
    isLoadingMail ||
    isLoadingPincode ||
    isLoadingAlreadyOrdered ||
    isLoadingPeriodica;

  const isValidPincode =
    orderService === "ILL" && pincodeIsRequired ? !!pincode : true;
  const details = {
    pincode: {
      isValid: isValidPincode,
      message: !isValidPincode && { label: "missing-pincode" },
      checkBeforeConfirm: false,
    },
    mail: {
      isValid: !!isValidMail,
      message: !isValidMail && {
        label: mail ? "wrong-email-field" : "empty-email-field",
      },
      checkBeforeConfirm: false,
    },
    manifestations: {
      isValid: !!workId,
      checkBeforeConfirm: true,
      checkBeforeConfirm: false,
    },
    branch: { isValid: !!pickupBranch?.branchId, checkBeforeConfirm: true },
    orderService: {
      isValid: orderService === "DIGITAL_ARTICLE" || orderService === "ILL",
      checkBeforeConfirm: true,
    },
    orderedBeforeWarning: {
      isValid: !showAlreadyOrderedWarning,
      message: showAlreadyOrderedWarning && { label: "alreadyOrderedText" },
      checkBeforeConfirm: false,
    },
    periodica: {
      isValid: !isPeriodica || !!periodicaForm?.publicationDateOfComponent,
      message: isPeriodica &&
        !periodicaForm?.publicationDateOfComponent && { label: "require-year" },
      checkBeforeConfirm: false,
    },
    isBlocked: {
      isValid: orderService !== "ILL" || !pickupBranch?.isBlocked,
    },
  };

  const isValid =
    !isLoading &&
    Object.values(details).filter((entry) => !entry.isValid).length === 0;

  const errors = Object.values(details).filter((entry) => {
    if (!confirmButtonClicked && !entry.checkBeforeConfirm) {
      return false;
    }
    return !entry.isValid;
  });
  const confirmButtonDisabled = errors.length > 0;
  const actionMessages = errors
    .filter((entry) => entry.message)
    .map((entry) => entry.message);

  return { isValid, confirmButtonDisabled, actionMessages, details, isLoading };
}

export function useOrderPolicy({ branchId, pids }) {
  const { data, isLoading } = useData(
    branchId && pids?.length && branchOrderPolicy({ pids, branchId })
  );
  return {
    isLoading: !data || isLoading,
    digitalCopyAllowed: !!data?.branches?.result?.[0]?.digitalCopyAccess,
    physicalCopyAllowed:
      !!data?.branches?.result?.[0]?.orderPolicy?.orderPossible,
    physicalCopyAllowedReason:
      data?.branches?.result?.[0]?.orderPolicy?.orderPossibleReason,
  };
}

function useSingleMaterialValidation(order) {
  const materialData = useManifestationData({ pids: order.pids });
  return {
    pids: order.pids,
    alreadyOrdered: useShowAlreadyOrdered({ pids: order.pids }),
    manifestationAccess: useManifestationAccess({
      pids: order.pids,
      filter: [
        AccessEnum.INTER_LIBRARY_LOAN,
        AccessEnum.DIGITAL_ARTICLE_SERVICE,
      ],
    }),
    orderService: useOrderService({ pids: order.pids }),
    validation: useOrderValidation({ pids: order.pids }),
    materialData,
    periodicaForm: usePeriodicaForm(materialData?.workId),
    order,
  };
}
export function useMultiOrderValidation({ orders }) {
  const { result } = useMany(
    "multiOrderValidation",
    orders,
    useSingleMaterialValidation
  );

  const validation = useMemo(() => {
    return {
      materialsMissingActionCount: result?.filter(
        (entry) => !entry?.validation?.details?.periodica?.isValid
      )?.length,

      materialsNotAllowedCount: result?.filter(
        (entry) => !entry?.validation?.details?.orderService?.isValid
      )?.length,
      materialsNotAllowedCount: result?.filter(
        (entry) => !entry?.validation?.details?.orderService?.isValid
      )?.length,
      materialsToOrderCount: orders?.length,
      materialUnsupportedCount: result?.filter(
        (entry) =>
          !entry?.manifestationAccess?.hasDigitalCopy &&
          !entry?.manifestationAccess?.hasPhysicalCopy
      )?.length,
      digitalMaterialsCount: result?.filter(
        (entry) => entry?.orderService?.service === "DIGITAL_ARTICLE"
      )?.length,
      physicalMaterialsCount: result?.filter(
        (entry) => entry?.orderService?.service === "ILL"
      )?.length,
      missingPincode: !!result?.find(
        (entry) => !entry?.validation?.details?.pincode?.isValid
      ),
      missingMail: !!result?.find(
        (entry) => !entry?.validation?.details?.mail?.isValid
      ),
      alreadyOrdered: result?.filter(
        (entry) => entry?.alreadyOrdered?.showAlreadyOrderedWarning
      ),
      validatedOrders: result,
      isValid: result?.every((entry) => entry?.validation?.isValid),
    };
  }, [result]);

  const isLoading = useMemo(
    () => !result?.every((entry) => entry?.validation?.isLoading === false),
    [result]
  );

  return {
    ...validation,
    isLoading,
  };
}

const formatArticleForm = (formData, pid) => {
  if (!formData || !pid) return null;

  const { publicationDateOfComponent, authorOfComponent, titleOfComponent } =
    formData;

  return {
    publicationDateOfComponent,
    volumeOfComponent: formData.volume,
    authorOfComponent,
    titleOfComponent,
    pagesOfComponent: formData.pagination,
  };
};

export function useSubmitOrders({ orders }) {
  const ordersKey = useMemo(() => JSON.stringify(orders), [orders]);
  const [receipt, setReceipt] = useGlobalState({
    key: `receipt:${ordersKey}`,
    initial: {},
  });

  const orderMutation = useMutate();

  const validation = useMultiOrderValidation({ orders });
  const { loanerInfo } = useLoanerInfo();
  const { mail } = useMail();
  const { branchId } = usePickupBranchId();

  const setOrderCompleted = useGlobalState({
    key: "orderCompleted",
    initial: false,
  });
  const userParameters = loanerInfo?.userParameters;
  const isReady = !!validation?.isValid;
  const { pincode, pincodeIsRequired } = usePincode();

  async function submitOrders() {
    if (!isReady) {
      return;
    }
    const materialsToOrder = validation?.validatedOrders?.map((entry) => {
      const periodicaForm =
        entry?.periodicaForm?.periodicaForm &&
        formatArticleForm(
          entry?.periodicaForm?.periodicaForm,
          entry?.pids?.[0]
        );
      return {
        key: `${
          entry?.materialData?.workId
        }${entry?.materialData?.ownerWork?.materialTypes
          ?.map?.((type) => type?.materialTypeSpecific?.code)
          ?.join(" / ")}`,
        pids: entry?.pids,
        ...(periodicaForm || {}),
      };
    });
    const materialsToOrderInfo = validation?.validatedOrders?.map((entry) => {
      return {
        key: `${
          entry?.materialData?.workId
        }${entry?.materialData?.ownerWork?.materialTypes
          ?.map?.((type) => type?.materialTypeSpecific?.code)
          ?.join(" / ")}`,
        ...entry,
      };
    });
    setReceipt({ isSubmitting: true });
    const res = await orderMutation.post(
      orderMutations.submitMultipleOrders({
        materialsToOrder,
        branchId,
        userParameters: {
          ...userParameters,
          userMail: mail,
          pincode: pincodeIsRequired ? pincode : undefined,
        },
      })
    );
    const failedMaterialsPids =
      res?.data?.submitMultipleOrders?.failedAtCreation?.map((key) =>
        materialsToOrder?.find((entry) => entry?.key === key)
      );
    const successfullyCreatedPids =
      res?.data?.submitMultipleOrders?.successfullyCreated?.map((key) =>
        materialsToOrderInfo?.find((entry) => entry?.key === key)
      );

    const receipt = {
      isSubmitting: false,
      ...(res?.data?.submitMultipleOrders || {}),
      failedMaterialsPids,
      successfullyCreatedPids,
      error: res?.error,
    };
    setReceipt(receipt);
    setTimeout(() => {
      receipt?.successfullyCreatedPids?.forEach((entry) => {
        const workId = entry?.materialData?.workId;
        setAlreadyOrdered(workId);
      });
      setOrderCompleted[1](Date.now());
    }, 1000);

    return receipt;
  }

  return {
    isReady,
    ...receipt,
    submitOrders,
  };
}

export function useOrderFlow() {
  const modal = useModal();
  const { branchId } = usePickupBranchId();
  const { isAuthenticated } = useAuthentication();

  const storedOrders = useMemo(() => {
    // return [];
    return JSON.parse(getSessionStorageItem("storedOrders") || "[]");
  }, []);

  const [initialOrders, setInitialOrders] = useGlobalState({
    key: "initialMultiOrderList",
    initial: storedOrders,
  });
  const [orders, setOrders] = useGlobalState({
    key: "multiOrderList",
    initial: storedOrders,
  });
  function deleteOrder({ pids }) {
    const newOrders = orders.filter((order) => !isEqual(order.pids, pids));
    setOrders(newOrders);
  }

  function start({ orders }) {
    setSessionStorageItem("storedOrders", JSON.stringify(orders));
    setInitialOrders(orders);
    setOrders(orders);
    if (isAuthenticated || branchId) {
      modal.push("ematerialfilter", {});
    } else {
      const callbackUID = modal.saveToStore("ematerialfilter", {});
      openLoginModal({ modal, mode: LOGIN_MODE.ORDER_PHYSICAL, callbackUID });
    }
  }

  return { start, initialOrders, orders, setOrders, deleteOrder };
}

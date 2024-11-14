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
import { setGlobalState, useGlobalState } from "./useGlobalState";
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
import useDataCollect from "@/lib/useDataCollect";
import { IconLink } from "../base/iconlink/IconLink";
import { useHoldingsForAgency } from "./useHoldings";
import Translate from "../base/translate/Translate";
import ExternalSvg from "@/public/icons/external_small.svg";
import animations from "@/components/base/animation/animations.module.css";
import styles from "./order.module.css";
import useSubdomainToAgency from "@/components/hooks/useSubdomainToAgency";

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
  const { agency } = useSubdomainToAgency();
  const branchId = agency.branchId;

  const {
    digitalCopyPids,
    physicalCopyPids,
    isLoading: accessIsLoading,
  } = useManifestationAccess({
    pids: pids,
    filter: [AccessEnum.INTER_LIBRARY_LOAN, AccessEnum.DIGITAL_ARTICLE_SERVICE],
  });

  // @TODO .. is this necessary .. maybe agency.pickupAllowed is enough
  const policy = useOrderPolicy({
    branchId,
    pids,
  });

  const { loanerInfo, isLoading: userIsLoading } = useLoanerInfo();

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
    loanerInfo?.rights?.digitalArticleService &&
    (!isPeriodica || (isPeriodica && articleIsSpecified))
  ) {
    service = "DIGITAL_ARTICLE";
    pidsToUse = digitalCopyPids;
  } else if (physicalCopyPids?.length > 0 && policy?.physicalCopyAllowed) {
    service = "ILL";
    pidsToUse = physicalCopyPids;
  }

  const isLoading =
    accessIsLoading || userIsLoading || isLoadingPeriodica || policy.isLoading;

  return {
    service: !isLoading && service,
    pids: !isLoading && pidsToUse,
    isLoading,
  };
}

export function useManifestationData({ pids }) {
  const { data, isLoading } = useData(
    pids?.length > 0 &&
      editionManifestations({
        pid: pids,
      })
  );

  const physicalPids = {};
  const physicalUnitPids = {};
  data?.manifestations?.forEach((m) => {
    const isPhysical = !!m?.accessTypes?.find((t) => t?.code === "PHYSICAL");
    physicalPids[m?.pid] = true;
    if (isPhysical) {
      m?.unit?.manifestations?.forEach(
        ({ pid }) => (physicalUnitPids[pid] = true)
      );
    }
  });

  const workId = data?.manifestations?.[0]?.ownerWork?.workId;
  const ownerWork = data?.manifestations?.[0]?.ownerWork;
  return {
    workId,
    ownerWork,
    manifestations: data?.manifestations,
    physicalUnitPids: Object.keys(physicalUnitPids),
    physicalPids: Object.keys(physicalPids),
    isLoading,
  };
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

  const { isPeriodica, isLoading: periodicaIsLoading } = usePeriodica({ pids });

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
    showAlreadyOrderedWarning:
      hasAlreadyBeenOrdered && !acceptedAlreadyOrdered && !isPeriodica,
    isLoading: manifestationIsLoading || periodicaIsLoading,
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
  const [periodicaForm, updatePeriodicaForm] = useGlobalState({
    key: periodicaFormCacheKey(periodicaFormKey),
    initial: null,
  });
  const [expanded, setExpanded] = useGlobalState({
    key: `periodicaForm-expanded-${periodicaFormKey}`,
    initial: false,
  });

  const articleIsSpecified = !!(
    periodicaForm?.authorOfComponent ||
    periodicaForm?.titleOfComponent ||
    periodicaForm?.pagination
  );

  /**
   * generate a cache key for global state
   * @param periodicaKey
   * @returns {string}
   */
  function periodicaFormCacheKey(key) {
    return `periodicaForm-${key}`;
  }

  /**
   * reset a specific entry in global state
   * @param periodicaKey
   */
  function resetPeriodicaForm(periodicaKey) {
    const cacheKey = periodicaFormCacheKey(periodicaKey);
    setGlobalState(cacheKey, {});
  }

  return {
    expanded,
    setExpanded,
    periodicaForm,
    articleIsSpecified,
    updatePeriodicaForm,
    resetPeriodicaForm,
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

export function useMobileLibraryLocations() {
  const { branchId, isLoadingBranchId } = usePickupBranchId();
  const { mobileLibraryLocations, isLoading: isLoadingBranchInfo } =
    useBranchInfo({ branchId });

  const [mobileLibrary, setMobileLibrary] = useGlobalState({
    key: "mobileLibrarySelection",
    initial: "",
  });
  const isLoading = isLoadingBranchId || isLoadingBranchInfo;
  const mobileLibraryIsRequired = mobileLibraryLocations?.length > 0;

  return {
    mobileLibraryLocations,
    mobileLibraryIsRequired,
    mobileLibrary,
    setMobileLibrary,
    isLoading,
  };
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
  const {
    mobileLibrary,
    mobileLibraryIsRequired,
    isLoading: mobileLibraryIsLoading,
  } = useMobileLibraryLocations();

  const { showAlreadyOrderedWarning, isLoading: isLoadingAlreadyOrdered } =
    useShowAlreadyOrdered({ pids });

  // pjo 08/10/24 bug BIBDK2021-2781
  // we need localizations since we do NOT allow order of materials with no localizations
  // const { data: localizationsData, isLoading: isLoadingLocalizations } =
  //   useData(localizationsFragments.localizationsQuery({ pids: pids }));
  // const localizationsCount = localizationsData?.localizations?.count;

  const { confirmButtonClicked } = useConfirmButtonClicked();

  // Can only be validated when all data is loaded
  const isLoading =
    // isLoadingLocalizations ||
    isLoadingPickupBranchId ||
    pickupBranch?.isLoading ||
    isLoadingOrderService ||
    isLoadingMail ||
    isLoadingPincode ||
    isLoadingAlreadyOrdered ||
    isLoadingPeriodica ||
    mobileLibraryIsLoading;

  const isValidPincode = pincodeIsRequired ? !!pincode : true;
  const details = {
    noLocation: {
      isValid: true,
      checkBeforeConfirm: true,
    },
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
    mobileLibrary: {
      isValid: !!(!mobileLibraryIsRequired || mobileLibrary),
      message: { label: "missing-mobile-library" },
      checkBeforeConfirm: true,
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
      noLocation: !!result?.find(
        (entry) => !entry?.validation?.details?.noLocation?.isValid
      ),
      materialsMissingActionCount: result?.filter(
        (entry) => !entry?.validation?.details?.periodica?.isValid
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
      missingMobileLibrary: !!result?.find(
        (entry) => !entry?.validation?.details?.mobileLibrary?.isValid
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
  const collect = useDataCollect();
  const ordersKey = useMemo(() => JSON.stringify(orders), [orders]);
  const [receipt, setReceipt] = useGlobalState({
    key: `receipt:${ordersKey}`,
    initial: {},
  });

  const { resetPeriodicaForm } = usePeriodicaForm();

  const orderMutation = useMutate();

  const validation = useMultiOrderValidation({ orders });
  const { loanerInfo } = useLoanerInfo();
  const { mail } = useMail();
  const { branchId } = usePickupBranchId();
  const { mobileLibrary } = useMobileLibraryLocations();

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

      //default key to use if bookmarkKey is not provided
      const orderKey = `${
        entry?.materialData?.workId
      }${entry?.materialData?.ownerWork?.materialTypes
        ?.map?.((type) => type?.materialTypeSpecific?.code)
        ?.join(" / ")}`;

      const materialToOrder = {
        key: entry?.order?.bookmarkKey || orderKey,
        pids: entry?.pids,
      };

      if (periodicaForm) {
        materialToOrder.periodicaForm = {
          pid: entry?.pids?.[0],
          ...periodicaForm,
        };
      }
      return materialToOrder;
    });
    const materialsToOrderInfo = validation?.validatedOrders?.map((entry) => {
      //default key to use if bookmarkKey is not provided
      const orderKey = `${
        entry?.materialData?.workId
      }${entry?.materialData?.ownerWork?.materialTypes
        ?.map?.((type) => type?.materialTypeSpecific?.code)
        ?.join(" / ")}`;

      return {
        key: entry?.order?.bookmarkKey || orderKey,
        ...entry,
      };
    });
    setReceipt({ isSubmitting: true });
    const res = await orderMutation.post(
      orderMutations.submitMultipleOrders({
        materialsToOrder,
        branchId,
        mobileLibrary: mobileLibrary ? mobileLibrary : undefined,
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
        resetPeriodicaForm(workId);
      });
      setOrderCompleted[1](Date.now());
    }, 1000);

    const summary = validation?.validatedOrders?.map((order) => ({
      title: order?.materialData?.manifestations?.[0]?.titles?.full,
      materialTypes: order?.materialData?.manifestations?.[0]?.materialTypes
        ?.map((type) => type?.materialTypeSpecific?.code)
        ?.join(", "),
    }));
    collect.collectSubmitOrder(summary);

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
  const collect = useDataCollect();

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

  /**
   * Strart order flow - if initialbracnch is set we open adgangsplatform, if user is authenticated we go to orderpage
   * if user is NOT authenticated we start the login flow.
   * @param orders
   * @param initialBranch
   */
  function start({ orders, initialBranch = null }) {
    setSessionStorageItem("storedOrders", JSON.stringify(orders));
    setInitialOrders(orders);
    setOrders(orders);
    collect.collectStartOrderFlow({ count: orders?.length });

    if (isAuthenticated || branchId) {
      modal.push("ematerialfilter", {});
    } else if (initialBranch) {
      const callbackUID = modal.saveToStore("ematerialfilter", {});
      modal.push("openAdgangsplatform", {
        agencyId: initialBranch.agencyId,
        branchId: initialBranch.branchId,
        name: initialBranch.name,
        agencyName: initialBranch.agencyName,
        callbackUID: callbackUID,
      });
    } else {
      const callbackUID = modal.saveToStore("ematerialfilter", {});
      openLoginModal({ modal, mode: LOGIN_MODE.ORDER_PHYSICAL, callbackUID });
    }
  }

  return { start, initialOrders, orders, setOrders, deleteOrder };
}

/**
 * Shows a message, when order policy is false
 */
export function useOrderPolicyMessage({ pids, branchId, textType = "type2" }) {
  const branch = useBranchInfo({ branchId });
  const policy = useOrderPolicy({ branchId, pids });
  const { branches } = useHoldingsForAgency({
    pids,
    agencyId: branch?.agencyId,
  });
  const lookupUrl = branches?.[0]?.holdings?.lookupUrl;

  const showMessage =
    policy?.physicalCopyAllowedReason === "OWNED_OWN_CATALOGUE";

  if (showMessage) {
    return (
      <div className={styles.path_blue}>
        {Translate({
          context: "localizations",
          label: "no_pickup_allowed_for_material",
          vars: [branch?.name],
        })}
        <IconLink
          iconPlacement="right"
          iconSrc={ExternalSvg}
          iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
          textType={textType}
          href={lookupUrl}
          target="_blank"
          iconStyle={{ stroke: "blue" }}
        >
          {Translate({
            context: "localizations",
            label: "order_locally",
          })}
        </IconLink>
      </div>
    );
  }
}

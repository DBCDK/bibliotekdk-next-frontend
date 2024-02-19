/**
 * @file React hooks related to ordering via ILL or digital article service
 */

import { editionManifestations } from "@/lib/api/manifestation.fragments";
import { AccessEnum } from "@/lib/enums";
import { useEffect, useMemo } from "react";
import { useModal } from "../_modal";
import { workHasAlreadyBeenOrdered } from "../_modal/pages/order/utils/order.utils";
import { useGlobalState } from "./useGlobalState";
import { useManifestationAccess } from "./useManifestationAccess";

import { useData } from "@/lib/api/api";
import useAuthentication from "./user/useAuthentication";
import useLoanerInfo from "./user/useLoanerInfo";
import { extendedData } from "@/lib/api/user.fragments";
import { useBranchInfo } from "./useBranchInfo";
import { validateEmail } from "@/utils/validateEmail";
import { branchOrderPolicy } from "@/lib/api/branches.fragments";

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

  return { isPeriodica, isLoading };
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
  const { isPeriodica, isLoading: isLoadingPeriodica } = usePeriodica({ pids });
  const { articleIsSpecified } = usePeriodicaForm();

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

  const workId = manifestationsData?.manifestations?.[0]?.ownerWork?.workId;

  const hasAlreadyBeenOrdered = useMemo(
    () => workHasAlreadyBeenOrdered(workId),
    [workId]
  );
  const [acceptedAlreadyOrdered, setAcceptedAlreadyOrdered] = useGlobalState({
    key: "acceptedAlreadyOrdered",
    initial: false,
  });
  const isInOrderModal = useIsInOrderModal();

  // Reset acceptance, when user leaves order flow
  useEffect(() => {
    if (isInOrderModal) {
      setAcceptedAlreadyOrdered(false);
    }
  }, [isInOrderModal]);

  return {
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
  return active?.id === "order" || active?.id === "pickup";
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

  const articleIsSpecified = !!(
    periodicaForm?.authorOfComponent ||
    periodicaForm?.titleOfComponent ||
    periodicaForm?.pagination
  );
  return {
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

  const [mail, setMail] = useGlobalState({ key: "mail", initial: "" });

  const mailFromPickupAgency = loanerInfo?.agencies?.find(
    (agency) => agency.id === pickupAgencyId
  )?.user?.mail;

  const isLoading =
    isLoadingBranchId || isLoadingBranchInfo || isLoadingLoanerInfo;

  return { mail, setMail, mailFromPickupAgency, isLoading };
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
  const { data: manifestationsData, isLoading: isLoadingManifestations } =
    useData(
      pids?.length > 0 &&
        editionManifestations({
          pid: pids,
        })
    );

  const { branchId, isLoading: isLoadingPickupBranchId } = usePickupBranchId();
  const pickupBranch = useBranchInfo({ branchId });
  const { service: orderService, isLoading: isLoadingOrderService } =
    useOrderService({ pids });
  const { periodicaForm } = usePeriodicaForm();
  const { mailFromPickupAgency, mail, isLoading: isLoadingMail } = useMail();
  const {
    pincode,
    pincodeIsRequired,
    isLoading: isLoadingPincode,
  } = usePincode();
  const { showAlreadyOrderedWarning, isLoading: isLoadingAlreadyOrdered } =
    useShowAlreadyOrdered({ pids });
  const { isPeriodica, isLoading: isLoadingPeriodica } = usePeriodica({ pids });
  const { confirmButtonClicked } = useConfirmButtonClicked();
  const workId = manifestationsData?.manifestations?.[0]?.ownerWork?.workId;

  // Can only be validated when all data is loaded
  const isLoading =
    isLoadingManifestations ||
    isLoadingPickupBranchId ||
    pickupBranch?.isLoading ||
    isLoadingOrderService ||
    isLoadingMail ||
    isLoadingPincode ||
    isLoadingAlreadyOrdered ||
    isLoadingPeriodica;

  const mailInUse = mail || mailFromPickupAgency || "";
  const isValidMail = validateEmail(mailInUse);
  const isValidPincode = pincodeIsRequired ? !!pincode : true;
  const details = {
    pincode: {
      isValid: isValidPincode,
      message: !isValidPincode && { label: "missing-pincode" },
      checkBeforeConfirm: false,
    },
    mail: {
      isValid: isValidMail,
      message: !isValidMail && {
        label: mailInUse ? "wrong-email-field" : "empty-email-field",
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
      isValid: !isPeriodica || periodicaForm?.publicationDateOfComponent,
      message: isPeriodica &&
        !periodicaForm?.publicationDateOfComponent && { label: "require-year" },
      checkBeforeConfirm: false,
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

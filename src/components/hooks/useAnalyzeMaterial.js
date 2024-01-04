import { useMemo } from "react";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
} from "@/lib/accessFactoryUtils";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import {
  flattenMaterialType,
  manifestationMaterialTypeFactory,
  toFlatMaterialTypes,
} from "@/lib/manifestationFactoryUtils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

/**
 * Returns true if first access is neither DigitalArticleService or InterLibraryLoan
 * @param {Object} material
 * @returns {boolean}
 */
export const useAnalyzeMaterial = (material) => {
  const { loanerInfo } = useLoanerInfo();

  const hasDigitalAccess = loanerInfo?.rights?.digitalArticleService;

  const { workId, pid } = material;
  const selectedManifestations = material?.manifestations;

  const materialTypes = flattenMaterialType(selectedManifestations?.[0]);
  const flattenedDisplayTypes = toFlatMaterialTypes(
    materialTypes,
    "specificDisplay"
  );

  const { flatPidsByType } = useMemo(() => {
    return manifestationMaterialTypeFactory(selectedManifestations);
  }, [workId, selectedManifestations, materialTypes]);

  const selectedPids = useMemo(
    //TODO use
    () =>
      !!pid
        ? [pid]
        : flatPidsByType(
            flattenedDisplayTypes //should i give all the material types here? --> presentation material type
          ),
    [selectedManifestations]
  );

  const { manifestations, isLoading: isLoading } =
    useGetManifestationsForOrderButton(workId, selectedPids);

  const { getAllAllowedEnrichedAccessSorted } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  const access = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess) || [],
    [manifestations, hasDigitalAccess]
  );
  //the first access is always the most "generous", therefor its enough to check the first access
  const digitalCopy = checkDigitalCopy(access)?.[0];
  const physicalCopy = checkPhysicalCopy(access)?.[0];

  return !digitalCopy && !physicalCopy;
};

export default useAnalyzeMaterial;

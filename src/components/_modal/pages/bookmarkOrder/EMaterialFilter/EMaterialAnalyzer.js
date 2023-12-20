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
const useAnalyzeMaterial = (material) => {
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
    [material?.manifestations]
  );

  const { manifestations } = useGetManifestationsForOrderButton(
    workId,
    selectedPids
  );

  const { getAllAllowedEnrichedAccessSorted } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  const access = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess) || [],
    [manifestations, hasDigitalAccess]
  );
  const digitalCopy = checkDigitalCopy(access)?.[0];
  const physicalCopy = checkPhysicalCopy(access)?.[0];

  return !digitalCopy && !physicalCopy;
};

/**
 * Workaround for react hooks limitations
 * Since we cannot call a hook a dynamic amount of times, we need to render 1 React component for each material
 * (since hooks are designed for analysing 1 material - not x amount of material).
 * In that way we can reuse as much as possible from the 'normal' checkout flow
 *
 * Visually hidden JSX (by the parent), only used to pass data to parent
 */
const EMaterialAnalyzer = ({ material }) => {
  const result = useAnalyzeMaterial(material);

  return (
    <div data-accessable-ematerial={result} data-material-key={material.key} />
  );
};

export default EMaterialAnalyzer;

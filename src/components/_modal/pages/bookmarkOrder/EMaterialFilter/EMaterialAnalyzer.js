import { useMemo } from "react";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
} from "@/lib/accessFactoryUtils";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import { useBranchUserAndHasDigitalAccess } from "@/components/work/utils";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";

/**
 * Returns true if first access is neither DigitalArticleService or InterLibraryLoan
 * @param {Object} material
 * @returns {boolean}
 */
const useAnalyzeMaterial = (material) => {
  const { workId, materialType, pid } = material;
  const allManifestations = material?.manifestations?.mostRelevant;

  const { flatPidsByType } = useMemo(() => {
    return manifestationMaterialTypeFactory(allManifestations);
  }, [workId, allManifestations]);
  const selectedPids = useMemo(
    () => (!!pid ? [pid] : flatPidsByType([materialType?.toLowerCase()])),
    [materialType]
  );

  const { manifestations } = useGetManifestationsForOrderButton(
    workId,
    selectedPids
  );
  const { hasDigitalAccess } = useBranchUserAndHasDigitalAccess();
  const { getAllAllowedEnrichedAccessSorted } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );
  const access = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess) || [],
    [manifestations, hasDigitalAccess]
  );
  const physicalCopy = checkPhysicalCopy([access?.[0]])?.[0];
  const digitalCopy = checkDigitalCopy([access?.[0]])?.[0];

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

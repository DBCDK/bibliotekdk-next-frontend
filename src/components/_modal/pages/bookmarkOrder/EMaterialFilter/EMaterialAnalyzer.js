import { useMemo } from "react";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
} from "@/lib/accessFactoryUtils";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import {
  flatMapMaterialTypes,
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
  console.log("DIGI MATTTTTI", material);
  console.log("DIGI hasDigitalAccess", hasDigitalAccess);

  const { workId, pid } = material;
  const allManifestations = material?.manifestations;

  console.log("allManifestations ", allManifestations);

  const materialTypes = flattenMaterialType(allManifestations?.[0]);
  console.log("MATERIALTYPES ", materialTypes);
  const flattenedDisplayTypes = toFlatMaterialTypes(
    materialTypes,
    "specificDisplay"
  );

  const { flatPidsByType } = useMemo(() => {
    return manifestationMaterialTypeFactory(allManifestations);
  }, [workId, allManifestations, materialTypes]);

  console.log("flattenedDisplayTypes", flattenedDisplayTypes);

  console.log(
    "flattend",
    flatPidsByType(
      flattenedDisplayTypes //should i give all the material types here? --> presentation material type
    )
  );
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
  console.log("workid ", workId, "selected", selectedPids);

  console.log("HERE ", manifestations);

  const { getAllAllowedEnrichedAccessSorted } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  console.log(
    "getAllAllowedEnrichedAccessSorted",
    getAllAllowedEnrichedAccessSorted
  );
  const access = useMemo(
    () => getAllAllowedEnrichedAccessSorted(hasDigitalAccess) || [],
    [manifestations, hasDigitalAccess]
  );
  const x = checkDigitalCopy(access);
  console.log("x", x);
  const digitalCopy = x?.[0];
  const xy = checkPhysicalCopy(access);
  const physicalCopy = xy?.[0];
  console.log("DIGI xy", xy);

  console.log("DIGI ", physicalCopy, digitalCopy);
  console.log("digi access ", access);

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

  console.log("digi result", result);
  return (
    <div data-accessable-ematerial={result} data-material-key={material.key} />
  );
};

export default EMaterialAnalyzer;

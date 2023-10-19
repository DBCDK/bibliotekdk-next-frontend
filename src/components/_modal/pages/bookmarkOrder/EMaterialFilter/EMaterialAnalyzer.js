import { Fragment, useMemo } from "react";
import {
  accessFactory,
  checkDigitalCopy,
  checkPhysicalCopy,
} from "@/lib/accessFactoryUtils";
import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import { useBranchUserAndHasDigitalAccess } from "@/components/work/utils";

const analyzeMaterial = (material) => {
  const { workId, selectedPids } = material;
  const { manifestations } = useGetManifestationsForOrderButton(
    workId,
    selectedPids
  );
  const { hasDigitalAccess } = useBranchUserAndHasDigitalAccess(selectedPids);
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
  const onlineMaterialWithoutLoginOrLoginAtUrl = Boolean(
    access?.length > 0 && !digitalCopy && !physicalCopy
  );
  return onlineMaterialWithoutLoginOrLoginAtUrl;
};

/**
 * Workaround for react hooks limitations
 */
const EMaterialAnalyzer = ({ material }) => {
  const result = analyzeMaterial(material);

  return <div data-accessable-ematerial={result} data-material-id={material?.materialId}  />;
};

export default EMaterialAnalyzer;

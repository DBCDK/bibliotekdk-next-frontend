import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { useMemo } from "react";
import at from "lodash/at";

export function useGetManifestationsForOrderButton(workId, selectedPids) {
  const pids = selectedPids?.filter(
    (pid) => pid !== null && pid !== undefined && typeof pid !== "undefined"
  );

  // We use Work and allPids to enhance load speeds when browsing materialTypes
  const workResponse = useData(workId && workFragments.buttonTxt({ workId }));

  const allPids = useMemo(() => {
    return workResponse?.data?.work?.manifestations?.mostRelevant?.flatMap(
      (manifestation) => manifestation.pid
    );
  }, [
    workId,
    selectedPids,
    workResponse?.data?.work?.manifestations?.mostRelevant,
  ]);

  const manifestationsResponse = useData(
    allPids &&
      allPids?.length > 0 &&
      manifestationFragments.reservationButtonManifestations({ pid: allPids })
  );

  const selectedManifestationsPids = pids?.map((pid) => {
    return allPids?.findIndex((pidFromAll) => pidFromAll === pid);
  });

  const manifestations = useMemo(() => {
    return (
      pids &&
      selectedManifestationsPids &&
      at(
        manifestationsResponse?.data?.manifestations,
        selectedManifestationsPids
      )
    );
  }, [
    pids,
    selectedManifestationsPids,
    manifestationsResponse?.data?.manifestations,
  ]);

  return {
    workResponse,
    manifestations,
    manifestationsResponse,
    selectedManifestationsPids,
  };
}

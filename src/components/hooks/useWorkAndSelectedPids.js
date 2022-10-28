import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { selectMaterialBasedOnType } from "@/components/work/reservationbutton/utils";
import { useMemo } from "react";

function filteredWork(work, selectedPids) {
  const manifestations = work?.manifestations?.all?.filter((manifestation) =>
    selectedPids?.includes(manifestation.pid)
  );

  return {
    ...work,
    manifestations: { all: manifestations },
    materialTypes: [{ specific: manifestations?.[0]?.materialTypes?.specific }],
  };
}

export function useWorkFromSelectedPids(workFragment, selectedPids) {
  const { data } = useData(workFragment);

  return useMemo(() => {
    return selectedPids?.length > 0
      ? filteredWork(data?.work, selectedPids)
      : data?.work;
  }, [data?.work, selectedPids]);
}

export function useGetPidsFromWorkIdAndType(workId, type) {
  const pidsAndMaterialTypes = useData(
    workId && workFragments.pidsAndMaterialTypes({ workId })
  );

  return selectMaterialBasedOnType(
    pidsAndMaterialTypes?.data?.work?.manifestations?.all,
    type
  )?.map((manifestation) => manifestation.pid);
}

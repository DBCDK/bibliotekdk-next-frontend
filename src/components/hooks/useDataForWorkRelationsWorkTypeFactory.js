import { workRelationsWorkTypeFactory } from "@/lib/workRelationsWorkTypeFactoryUtils";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

export default function useDataForWorkRelationsWorkTypeFactory({ workId }) {
  const {
    data: relationData,
    isLoading: relationsIsLoading,
    error: relationsError,
  } = useData(workFragments.workForWorkRelationsWorkTypeFactory({ workId }));

  return {
    workRelationsWorkTypeFactory: workRelationsWorkTypeFactory(
      relationData?.work
    ),
    data: relationData,
    isLoading: relationsIsLoading,
    error: relationsError,
  };
}

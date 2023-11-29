import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import * as universeFragments from "@/lib/api/universe.fragments";
import Custom404 from "@/pages/404";
import isArray from "lodash/isArray";
import { useEffect } from "react";
import UniverseHeading from "@/components/universe/universeHeading/UniverseHeading";
import isEmpty from "lodash/isEmpty";
import groupBy from "lodash/groupBy";
import UniverseMembers from "@/components/universe/universeMembers/UniverseMembers";

export default function UniversePage() {
  const router = useRouter();

  const { workId, universeNumber: universeNumberAsString } = router.query;

  const universeNumber = parseInt(
    isArray(universeNumberAsString)
      ? universeNumberAsString?.[0]
      : universeNumberAsString
  );

  const {
    data: universeData,
    isLoading: universeIsLoading,
    error: univserseError,
  } = useData(workId && universeFragments.universes({ workId: workId }));

  useEffect(() => {
    const chosenUniverse = universeData?.work?.universes?.[universeNumber];

    if (!universeIsLoading && (!chosenUniverse || isEmpty(chosenUniverse))) {
      if (universeNumber === 0) {
        router?.replace(`/work/${workId}`);
      }

      router?.replace({
        pathname: router.pathname,
        query: { ...router.query, universeNumber: 0 },
      });
    }
  }, [
    universeIsLoading,
    universeNumber,
    universeData?.work?.universes?.[universeNumber]?.length,
  ]);

  const universes = universeData?.work?.universes;
  const specificUniverse = universes?.[universeNumber];

  const seriesInUniverse = specificUniverse?.series;
  const worksInUniverse = groupBy(specificUniverse?.works, "workTypes");

  if (univserseError) {
    return <Custom404 />;
  }

  return (
    <>
      <Header router={router} />
      <main>
        <UniverseHeading
          universe={specificUniverse}
          universeIsLoading={universeIsLoading}
        />
        <UniverseMembers
          worksInUniverse={worksInUniverse}
          seriesInUniverse={seriesInUniverse}
        />
      </main>
    </>
  );
}

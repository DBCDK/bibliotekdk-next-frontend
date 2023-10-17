import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Translate, { getLanguage } from "@/components/base/translate";
import Text from "@/components/base/text";

export function Breadcrumbs({ children }) {
  return <Text>{children.join(" / ")}</Text>;
}

export default function Wrap({ workId }) {
  const work_response = useData(
    workId && workFragments.overviewWork({ workId: workId })
  );

  const work = work_response?.data?.work;

  const workType =
    work?.workTypes?.length > 0
      ? [
          Translate({
            context: "facets",
            label: `label-${work?.workTypes?.[0]?.toLowerCase()}`,
          }),
        ]
      : [];

  const childrenOrAdults = work?.manifestations?.mostRelevant
    ?.flatMap((manifestation) => manifestation?.audience?.childrenOrAdults)
    .filter((childOrAdult) => childOrAdult.code === "FOR_CHILDREN")
    .map((childOrAdult) => {
      return getLanguage() === "EN_GB" ? "for children" : childOrAdult?.display;
    })?.[0];

  const fictionNonfiction =
    work?.fictionNonfiction?.code !== "NOT_SPECIFIED" &&
    work?.fictionNonfiction !== null
      ? [
          (getLanguage() === "EN_GB"
            ? work?.fictionNonfiction?.code?.toLowerCase()
            : work?.fictionNonfiction?.display) +
            (childrenOrAdults ? " " + childrenOrAdults : ""),
        ]
      : [];

  const genreAndForm =
    work?.genreAndForm?.length > 0 ? [work?.genreAndForm?.[0]] : [];

  if (work_response.isLoading || !work_response.data || work_response.error) {
    return null;
  }

  // TODO: Update this when JED 1.0 is aired
  //  There will be some new materialTypes for JED 1.0
  if (work?.workTypes?.includes("OTHER")) {
    if (
      work?.materialTypes
        ?.map((mat) => mat?.materialTypeSpecific?.display)
        ?.includes("spil")
    ) {
      return (
        <Breadcrumbs>
          {[
            Translate({
              context: "general",
              label: `games`,
            }),
            Translate({
              context: "general",
              label: `boardgames`,
            }),
          ]}
        </Breadcrumbs>
      );
    } else {
      return <Breadcrumbs>{["Andre materialer"]}</Breadcrumbs>;
    }
  } else if (work?.workTypes?.includes("GAME")) {
    if (
      work?.materialTypes
        ?.map((mat) => mat?.materialTypeGeneral?.display)
        ?.includes("computerspil")
    ) {
      return (
        <Breadcrumbs>
          {[
            Translate({
              context: "general",
              label: `games`,
            }),
            Translate({
              context: "general",
              label: `computergames`,
            }),
          ]}
        </Breadcrumbs>
      );
    }
  }

  return (
    <Breadcrumbs>
      {[...workType, ...fictionNonfiction, ...genreAndForm]}
    </Breadcrumbs>
  );
}

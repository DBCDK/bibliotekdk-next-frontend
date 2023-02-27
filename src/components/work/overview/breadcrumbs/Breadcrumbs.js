import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Translate from "@/components/base/translate";
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

  const fictionNonfiction =
    work?.fictionNonfiction?.code !== "NOT_SPECIFIED" &&
    work?.fictionNonfiction !== null
      ? [work?.fictionNonfiction?.display]
      : [];

  const genreAndForm =
    work?.genreAndForm?.length > 0 ? [work?.genreAndForm?.[0]] : [];

  if (work_response.isLoading || !work_response.data || work_response.error) {
    return null;
  }

  return (
    <Breadcrumbs>
      {[...workType, ...fictionNonfiction, ...genreAndForm]}
    </Breadcrumbs>
  );
}

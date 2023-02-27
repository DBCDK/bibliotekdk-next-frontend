import { useData } from "@/lib/api/api";
import { genreAndFormAndWorkTypes } from "@/lib/api/work.fragments";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";

function Breadcrumbs({ children }) {
  return <Text>{children.join(" / ")}</Text>;
}

export default function Wrap({ workId }) {
  const work_response = useData(
    workId && genreAndFormAndWorkTypes({ workId: workId })
  );

  const work = work_response?.data?.work;

  const workType = Translate({
    context: "facets",
    label: `label-${work?.workTypes?.[0]?.toLowerCase()}`,
  });

  const fictionNonfiction = work?.fictionNonfiction?.display;

  const genreAndForm = work?.genreAndForm?.[0] || null;

  if (work_response.isLoading || !work_response.data || work_response.error) {
    return null;
  }

  return (
    <Breadcrumbs>{[workType, fictionNonfiction, genreAndForm]}</Breadcrumbs>
  );
}

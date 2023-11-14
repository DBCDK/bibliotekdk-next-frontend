import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

export default function OtherWorksByTheAuthor({ series }) {
  const firstSeriesFirstWork = series?.[0]?.members?.[0]?.work;
  const firstWorkType = firstSeriesFirstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  }).toLowerCase();

  return (
    <Section
      title={`${Translate({
        context: "series_page",
        label: "other_works_by_the_author",
        vars: [workTypeTranslation],
      })} ${firstSeriesFirstWork?.creators?.[0]?.display}`}
      space={{ bottom: "var(--pt0)", top: "var(--pt4)" }}
    >
      <div>OtherWorksByTheAuthor</div>
    </Section>
  );
}

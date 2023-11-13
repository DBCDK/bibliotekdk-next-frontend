import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

export default function SeriesMembers({ series }) {
  const firstSeriesFirstWork = series?.[0]?.members?.[0]?.work;
  const firstWorkType = firstSeriesFirstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  });

  return (
    <Section
      title={`${Translate({
        context: "series_page",
        label: "series_members_heading",
        vars: [workTypeTranslation],
      })} ${firstSeriesFirstWork?.creators?.[0]?.display}`}
      space={{ bottom: "var(--pt0)", top: "var(--pt4)" }}
    >
      <div>SeriesMembers</div>
    </Section>
  );
}

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import SingleRelatedManifestation from "@/components/work/relatedworks/singlerelatedwork/SingleRelatedManifestation";
import { useData } from "@/lib/api/api";
import { workForWorkRelationsWorkTypeFactory } from "@/lib/api/work.fragments";
import { workRelationsWorkTypeFactory } from "@/lib/workRelationsWorkTypeFactoryUtils";
import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
function RelatedWorks({ relations, className, subtitle }) {
  const context = { context: "relatedworks" };
  const sliderId = "relatedWorks_slide";

  const relatedWorks = relations?.map((manifestation, index) => (
    <SingleRelatedManifestation key={index} manifestation={manifestation} />
  ));

  if (relations?.length === 0) {
    return null;
  }

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
      className={`${className}`}
      subtitle={subtitle}
    >
      <ScrollSnapSlider sliderId={sliderId}>{relatedWorks}</ScrollSnapSlider>
    </Section>
  );
}

export default function Wrap({ workId, subtitle }) {
  const workForWorkRelationsWorkTypeFactory_response = useData(
    workId && workForWorkRelationsWorkTypeFactory({ workId: workId })
  );

  const { flatRelations } = workRelationsWorkTypeFactory(
    workForWorkRelationsWorkTypeFactory_response?.data?.work
  );

  return <RelatedWorks relations={flatRelations} subtitle={subtitle} />;
}

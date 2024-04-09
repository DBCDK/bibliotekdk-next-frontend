import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { useData } from "@/lib/api/api";
import { workForWorkRelationsWorkTypeFactory } from "@/lib/api/work.fragments";
import { workRelationsWorkTypeFactory } from "@/lib/workRelationsWorkTypeFactoryUtils";
import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import uniq from "lodash/uniq";
import { WorkTypeEnum } from "@/lib/enums";
import Text from "@/components/base/text/Text";
const CONTEXT = "relatedworks";

function RelatedWorks({ relations, className, subtitleLabel }) {
  const sliderId = "relatedWorks_slide";

  const relatedWorks = relations?.map((relation, index) => {
    return <MaterialCard key={index} propAndChildrenInput={relation} />;
  });

  if (relations?.length === 0) {
    return null;
  }

  return (
    <Section
      title={Translate({ context: CONTEXT, label: "title" })}
      space={{ top: false, bottom: "var(--pt4)" }}
      className={`${className}`}
      subtitle={
        <Text type="text2">
          {Translate({ context: CONTEXT, label: subtitleLabel })}
        </Text>
      }
    >
      <ScrollSnapSlider sliderId={sliderId}>{relatedWorks}</ScrollSnapSlider>
    </Section>
  );
}

function getSubTitleLabelForRelatedWork(relations) {
  const relationWorkType =
    relations && uniq(relations.map((relation) => relation.relationWorkType));

  return relationWorkType?.length === 1
    ? `${relationWorkType[0]}-subtitle`
    : "";
}

export default function Wrap({ workId }) {
  const workForWorkRelationsWorkTypeFactory_response = useData(
    workId && workForWorkRelationsWorkTypeFactory({ workId: workId })
  );

  const { flatRelations } = workRelationsWorkTypeFactory(
    workForWorkRelationsWorkTypeFactory_response?.data?.work
  );

  // This functionality is opt-in for now
  //  Currently we only use Articles and debate articles
  const filteredFlatRelations = flatRelations?.filter((manifestation) =>
    [WorkTypeEnum.ARTICLE, WorkTypeEnum.DEBATEARTICLE].includes(
      manifestation.relationWorkType
    )
  );

  return (
    <RelatedWorks
      relations={filteredFlatRelations}
      subtitleLabel={getSubTitleLabelForRelatedWork(filteredFlatRelations)}
    />
  );
}

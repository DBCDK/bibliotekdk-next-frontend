import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import styles from "./issues.module.css";

import Text from "@/components/base/text/Text";
import { AllPeriodicaIssuesByworkId } from "@/lib/api/periodica.fragments";
import { useData } from "@/lib/api/api";
import { PeriodicaAccordion } from "@/components/work/periodicaArticles/PeriodicaArticles";
import translate from "@/components/base/translate/Translate";

export function Issues({ isLoading, entries }) {
  if (isLoading) {
    return <IssuesSkeleton />;
  }
  if (!entries || entries?.length < 1) {
    return null;
  }

  const parseForManifestations = (entry) => {
    return entry?.works
      ?.map((work) => [
        ...work?.manifestations?.all?.map((m) => ({ ...m, work })),
      ])
      .flat();
  };
  return (
    <Section
      title={translate({ context: "periodica", label: "title" })}
      divider={{ content: false }}
      dataCy="section-fisk"
      sectionTag="div" // Section sat in parent
    >
      {entries?.map((entry, index) => {
        const manifestations = parseForManifestations(entry);
        return (
          <PeriodicaAccordion
            key={index}
            issue={entry.display}
            manifestations={manifestations}
          />
        );
      })}
    </Section>
  );
}

function IssuesSkeleton() {
  const texts = [1, 2, 3, 4, 5, 6];
  return (
    <Section
      title={Translate({ context: "periodica", label: "articlestitle" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
    >
      {texts.map((txt) => (
        <row xs={6} md={3} key={`col-skeleton-${txt}`}>
          <Text type="text3" className={styles.title} lines={1} skeleton={true}>
            ...
          </Text>
        </row>
      ))}
    </Section>
  );
}

export default function Wrap({ workId }) {
  // get peridoca data
  const worksLimit = 20;
  const issuesLimit = 20;
  const { data, isLoading } = useData(
    AllPeriodicaIssuesByworkId({ id: workId, issuesLimit, worksLimit })
  );

  const entries = data?.work?.periodicaInfo?.periodica?.issues?.entries;

  return <Issues isLoading={isLoading} entries={entries} />;
}

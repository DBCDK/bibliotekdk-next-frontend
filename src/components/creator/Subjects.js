import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate/Translate";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import { subjectUrl } from "@/components/work/keywords/Keywords";
import kwStyles from "./Subjects.module.css";

import { useCreatorOverview } from "./Overview";

/**
 * Normalize a text for robust equality checks between creator name and subject terms.
 * We only keep letters to avoid mismatches caused by punctuation, spaces,
 * birth-year annotations, etc. Steps:
 * - Remove any parenthetical content like "(f. 1974)"
 * - Lowercase the string
 * - Strip diacritics (NFD + remove combining marks)
 * - Remove all non-letter characters (Unicode aware)
 */
const normalizeLetters = (str) => {
  if (!str) return "";

  let s = str.replace(/\([^()]*\)/g, " ");

  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // Fjern diakritiske tegn
    .replace(/[^\p{L}]+/gu, ""); // Fjern alt der ikke er bogstaver
};

/**
 * Renders the creator Subjects (Emneord) section styled like Work Keywords.
 * Displays a translated title, a subtitle with the creator name,
 * and a responsive list of subject links.
 */
export function Subjects({
  creatorId,
  subjects = [],
  className = "",
  skeleton = false,
}) {
  function getFontSize(subjects) {
    if (!subjects) return kwStyles.small;
    if (subjects.length <= 3) return kwStyles.large;
    if (subjects.length <= 6) return kwStyles.medium;
    return kwStyles.small;
  }

  const list = subjects?.length ? subjects : [];
  const sizeClass = getFontSize(list);

  return (
    <Section
      title={Translate({ context: "creator", label: "keywords" })}
      subtitle={
        <Text type="text3" tag="p" lines={1} skeleton={skeleton}>
          {Translate({
            context: "creator",
            label: "keywords-subtitle",
            vars: [creatorId],
          })}
        </Text>
      }
      divider={false}
      // backgroundColor="var(--jagged-ice)"
      headerTag="h2"
      dataCy="creator-subjects"
      isLoading={skeleton}
      className={kwStyles.section}
    >
      <div className={className}>
        <div className={kwStyles.keyword_group}>
          {list.map((subject) => (
            <span key={subject} className={`${kwStyles.keyword} ${sizeClass}`}>
              <Title type="title4" tag="div" lines={1} skeleton={skeleton}>
                <Link
                  href={subjectUrl(subject)}
                  border={{ bottom: { keepVisible: true } }}
                >
                  {subject}
                </Link>
              </Title>
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function SubjectsSkeleton(props) {
  const data = ["someKeyword1", "someKeyword2", "someKeyword3"];

  return (
    <Subjects
      {...props}
      subjects={data}
      className={`${props.className || ""} ${kwStyles.skeleton}`}
      skeleton={true}
    />
  );
}

export default function Wrap({ creatorId }) {
  const { data, isLoading } = useCreatorOverview(creatorId);

  if (isLoading) {
    return <SubjectsSkeleton creatorId={creatorId} />;
  }

  return (
    <Subjects
      creatorId={creatorId}
      subjects={data?.generated?.topSubjects?.slice(0, 12) || []}
    />
  );
}

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate/Translate";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import { subjectUrl } from "@/components/work/keywords/Keywords";
import kwStyles from "../work/keywords/Keywords.module.css";
import { useData } from "@/lib/api/api";
import { subjectFacets } from "@/lib/api/creator.fragments";
import { useMemo } from "react";

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

  // Fjern parentesindhold, men brug et simpelt mønster uden backtracking
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
      backgroundColor="var(--jagged-ice)"
      headerTag="h2"
      dataCy="creator-subjects"
      isLoading={skeleton}
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

/**
 * Wrapper: fetches SUBJECT facets for a creator and renders Subjects.
 * - Fetch via complexFacets with creator-based CQL
 * - Memoize extraction of facet values
 * - Filter out entries matching creator name (normalized to letters-only, no diacritics, no parenthesis)
 * - Sort by score desc and cap list (top 12)
 * - Show skeleton while loading; return null on error
 */
export default function Wrap({ creatorId }) {
  let { data, isLoading, error } = useData(
    creatorId && subjectFacets({ creatorId })
  );
  const subjects = useMemo(() => {
    const facets = data?.complexFacets?.facets || [];
    const subjectFacet = facets.find((f) => f.name === "facet.subject");
    const scored =
      subjectFacet?.values?.map((v) => ({ key: v.key, score: v.score })) || [];
    const normalizedCreator = normalizeLetters(creatorId);
    return scored
      .filter((v) => normalizeLetters(v.key) !== normalizedCreator)
      .sort((a, b) => b.score - a.score)
      .map((v) => v.key)
      .slice(0, 12);
  }, [data, creatorId]);

  if (isLoading) {
    return <SubjectsSkeleton creatorId={creatorId} />;
  }

  if (error) return null;

  return <Subjects creatorId={creatorId} subjects={subjects} />;
}

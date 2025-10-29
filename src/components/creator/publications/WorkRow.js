import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";
import Cover from "@/components/base/cover";
import { encodeTitleCreator } from "@/lib/utils";
import { getCoverImage } from "@/components/utils/getCoverImage";
import { subjectUrl } from "@/components/work/keywords/Keywords";
import { useMemo } from "react";
import styles from "./WorkRow.module.css";
import Translate, { hasTranslation } from "@/components/base/translate";

/**
 * WorkRow component - displays a work in a table-like format
 * Similar structure to PeriodicalArticle but for general works
 */
export function WorkRow({ work, isFirst = false, year, creatorId, isLoading }) {
  const manifestation = work?.manifestations?.bestRepresentation;
  const workId = work?.workId;

  const originalWorkYear =
    String(year?.key) !== String(work?.workYear?.year)
      ? work?.workYear?.year
      : null;

  const coverDetail = useMemo(() => {
    if (work?.manifestations?.mostRelevant) {
      return getCoverImage(work?.manifestations.mostRelevant)?.detail;
    }
    return getCoverImage(work?.manifestations?.all || [manifestation])?.detail;
  }, [work?.manifestations]);

  const url = `/materiale/${encodeTitleCreator(
    work?.titles?.full?.[0],
    work?.creators || []
  )}/${workId}`;

  const creators = [
    work?.creatorFunctions,
    ...(work?.creators || [])
      .filter((creator) => creator.display !== creatorId)
      .map((creator) => {
        const functionName = creator.roles?.[0]?.function?.singular;
        return `${creator.display} ${functionName ? `(${functionName})` : ""}`;
      }),
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <Link
      className={`${styles.row} ${isFirst ? styles.firstInGroup : ""}`}
      tabIndex={0}
      href={url}
      border={{ top: true, bottom: { keepVisible: false } }}
    >
      <div className={styles.coverColumn}>
        <Cover
          className={styles.cover}
          src={coverDetail}
          size="fill-width"
          skeleton={isLoading}
        />
      </div>

      <div className={styles.titleColumn}>
        <Text type="text1" lines={2} clamp={true} skeleton={isLoading}>
          {work?.titles?.full?.[0] || work?.titles?.main?.[0]}
        </Text>
        {creators && (
          <Text
            type="text3"
            className={styles.creators}
            lines={2}
            clamp={true}
            skeleton={isLoading}
          >
            {creators}
          </Text>
        )}

        {originalWorkYear && (
          <div className={styles.originalWorkYear}>
            <Text type="text3" lines={1} tag="span" skeleton={isLoading}>
              {originalWorkYear && `Oprindeligt udgivet ${originalWorkYear}`}
            </Text>
          </div>
        )}
      </div>

      <div className={styles.descriptionColumn}>
        <Text type="text3" lines={2} clamp={true} skeleton={isLoading}>
          {(!work?.abstract?.length && work?.genreAndForm?.join(", ")) || ""}
          {work?.abstract}
        </Text>
        <div className={styles.subjects}>
          {(
            work?.subjects?.dbcVerified || manifestation?.subjects?.dbcVerified
          )?.map((sub) => (
            <Link
              href={subjectUrl(sub.display)}
              border={{ bottom: { keepVisible: true } }}
              key={sub.display}
              className={styles.subject}
            >
              <Text
                tag="span"
                type="text3"
                key={sub.display}
                skeleton={isLoading}
              >
                {sub.display}
              </Text>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.extentColumn}>
        <Text
          type="text4"
          lines={1}
          className={styles.worktype}
          skeleton={isLoading}
        >
          {hasTranslation({
            context: "workTypeSingularForm",
            label: work?.workTypes?.[0]?.toLowerCase(),
          })
            ? Translate({
                context: "workTypeSingularForm",
                label: work?.workTypes?.[0]?.toLowerCase(),
              })
            : work?.materialTypes?.[0]?.materialTypeSpecific?.display || ""}
        </Text>
        {work?.extendedWork?.parentPeriodical?.titles?.main?.[0] && (
          <Text
            type="text5"
            lines={1}
            className={styles.hostpublication}
            skeleton={isLoading}
          >
            {work?.extendedWork?.parentPeriodical?.titles?.main?.[0]},{" "}
            {work?.extendedWork?.parentIssue?.display}
          </Text>
        )}
      </div>
    </Link>
  );
}

export default WorkRow;

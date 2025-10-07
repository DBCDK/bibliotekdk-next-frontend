import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";
import Cover from "@/components/base/cover";
import { encodeTitleCreator } from "@/lib/utils";
import { getCoverImage } from "@/components/utils/getCoverImage";
import { useMemo } from "react";
import styles from "./WorkRow.module.css";

/**
 * WorkRow component - displays a work in a table-like format
 * Similar structure to PeriodicalArticle but for general works
 */
export function WorkRow({ work, creatorId, isFirst = false }) {
  if (!work) {
    return null;
  }

  const manifestation = work.manifestations?.bestRepresentation;
  const workId = work.workId;

  const coverDetail = useMemo(() => {
    if (work?.manifestations?.mostRelevant) {
      return getCoverImage(work.manifestations.mostRelevant)?.detail;
    }
    return getCoverImage(work.manifestations?.all || [manifestation])?.detail;
  }, [work?.manifestations]);

  const url = `/materiale/${encodeTitleCreator(
    work?.titles?.full?.[0],
    work?.creators
  )}/${workId}`;

  return (
    <Link
      className={`${styles.row} ${isFirst ? styles.firstInGroup : ""}`}
      tabIndex={0}
      href={url}
      border={{ top: true, bottom: { keepVisible: false } }}
    >
      <div className={styles.coverColumn}>
        <Cover className={styles.cover} src={coverDetail} size="fill-width" />
      </div>
      <div>
        <div className={styles.workcontainer}>
          {/* <Text type="text3" className={styles.bold}> */}
          <Text type="text4" lines={2} clamp={true}>
            {work?.titles?.full?.[0] || work?.titles?.main?.[0]}
          </Text>
          {/* </Text> */}

          <Text type="text3" className={styles.creators} lines={1} clamp={true}>
            {work?.creators
              ?.filter((creator) => creator.display !== creatorId)
              ?.map((creator) => creator.display)
              .join(", ")}
          </Text>
        </div>
      </div>
      <div className={`${styles.description}`}>
        <Text type="text3" lines={3} clamp={true}>
          {work?.abstract || manifestation?.abstract}
        </Text>
      </div>
      <div className={`${styles.subjects}`}>
        <Text type="text3" lines={3} clamp>
          {(work?.subjects?.dbcVerified || manifestation?.subjects?.dbcVerified)
            ?.map((sub) => sub.display)
            .join(", ")}
        </Text>
      </div>
      <div className={`${styles.extent}`}>
        <Text type="text3">
          {manifestation?.physicalDescription?.summaryFull || ""}
        </Text>
      </div>
    </Link>
  );
}

/**
 * WorkHeader component - table header for WorkRow
 */
export function WorkHeader() {
  const headers = [
    { key: "cover", label: "" }, // Empty header for cover column
    { key: "title", context: "periodica", label: "tableheadertitle" },
    {
      key: "description",
      context: "periodica",
      label: "tableheaderdescription",
    },
    { key: "subjects", context: "periodica", label: "tableheadersubjects" },
    { key: "extent", context: "periodica", label: "tableheaderextent" },
  ];

  return (
    <div className={styles.headerrow}>
      {headers.map((head, index) => (
        <div
          key={index}
          className={`${styles.headline} ${
            styles[
              `tableHeader${
                head.key.charAt(0).toUpperCase() + head.key.slice(1)
              }`
            ]
          }`}
        >
          <Text type="text3" className={styles.bold}>
            {/* Using hardcoded text for now, could use translate */}
            {head.key === "cover" && ""} {/* Empty for cover */}
            {head.key === "title" && "Titel"}
            {head.key === "description" && "Beskrivelse"}
            {head.key === "subjects" && "Emner"}
            {head.key === "extent" && "Omfang"}
          </Text>
        </div>
      ))}
    </div>
  );
}

export default WorkRow;

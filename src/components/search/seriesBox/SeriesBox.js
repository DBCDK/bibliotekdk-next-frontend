import PropTypes from "prop-types";

import Link from "@/components/base/link";
import { getSeriesUrl, getWorkUrl } from "@/lib/utils";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import styles from "./SeriesBox.module.css";
import Cover from "@/components/base/cover/Cover";

const MEMBERS_PREVIEW_LIMIT = 3;

function buildMembersPreview(members = []) {
  return members
    ?.slice(0, MEMBERS_PREVIEW_LIMIT)
    .map((member, idx) => {
      const work = member?.work;
      const title = Array.isArray(work?.titles?.main)
        ? work?.titles?.main[0]
        : work?.titles?.main;
      const number = member?.numberInSeries;
      const mostRelevant = work?.manifestations?.mostRelevant;
      const primaryManifestation = Array.isArray(mostRelevant)
        ? mostRelevant?.[0]
        : mostRelevant;
      const image = primaryManifestation?.cover?.detail ?? null;
      const workId = work?.workId;
      const traceId = work?.traceId;
      const creators = work?.creators;

      if (!workId || !image) {
        return null;
      }

      return {
        key: workId || `${idx}`,
        title,
        number,
        image,
        workId,
        traceId,
        creators,
      };
    })
    .filter(Boolean);
}

/**
 * SeriesBox component for displaying series information in search results
 */
export default function SeriesBox({
  seriesHit,
  className = "",
  dataCy: dataCy,
}) {
  if (!seriesHit) {
    return null;
  }

  const { title, description, members, seriesId, traceId } = seriesHit;

  const seriesLink = seriesId ? getSeriesUrl(seriesId, traceId) : null;

  const membersPreview = buildMembersPreview(members);

  return (
    <section className={`${styles.block} ${className}`} data-cy={dataCy}>
      {title && (
        <div className={styles.headerRow}>
          <Text type="title3" tag="h3" className={styles.title}>
            {title}
          </Text>
        </div>
      )}

      {description && (
        <Text type="text2" className={styles.description}>
          {description}
        </Text>
      )}

      {members?.length > 0 && (
        <div>
          <div className={styles.thumbs}>
            {membersPreview.map((member, idx) => {
              const {
                key,
                title: memberTitle,
                number,
                image,
                workId,
                traceId: memberTraceId,
                creators,
              } = member;

              const workUrl = getWorkUrl(
                memberTitle || title,
                creators,
                workId,
                memberTraceId
              );

              return (
                <Link key={key} href={workUrl} className={styles.thumbLink}>
                  <div className={styles.thumb}>
                    <div className={styles.thumbImageWrapper}>
                      <Cover
                        src={image}
                        alt={memberTitle || ""}
                        //  className={styles.thumbImage}
                        size="fill-width"
                      />
                    </div>
                    <Text
                      type="text3"
                      tag="span"
                      className={styles.thumbNumber}
                    >
                      {number || `#${idx + 1}`}
                    </Text>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {seriesLink && (
        <Link
          href={seriesLink}
          className={styles.seeAllLink}
          border={{ bottom: { keepVisible: true } }}
        >
          {Translate({ context: "series", label: "go_to_series" })}
        </Link>
      )}
    </section>
  );
}

SeriesBox.propTypes = {
  seriesHit: PropTypes.object,
  className: PropTypes.string,
  "data-cy": PropTypes.string,
};

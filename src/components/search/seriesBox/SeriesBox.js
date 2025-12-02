import PropTypes from "prop-types";

import Link from "@/components/base/link";
import { getSeriesUrl, getWorkUrl } from "@/lib/utils";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import styles from "./SeriesBox.module.css";

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
  "data-cy": dataCy,
}) {
  if (!seriesHit) {
    return null;
  }

  const {
    title,
    description,
    // identifyingAddition,
    // hitcount,
    // alternativeTitles,
    // parallelTitles,
    // mainLanguages,
    // workTypes,
    // readThisFirst,
    // readThisWhenever,
    // isPopular,
    members,
    seriesId,
    traceId,
  } = seriesHit;

  const seriesLink = seriesId ? getSeriesUrl(seriesId, traceId) : null;

  const membersPreview = buildMembersPreview(members);

  return (
    <section className={`${styles.block} ${className}`} data-cy={dataCy}>
      {title && (
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}

      {description && <p className={styles.description}>{description}</p>}

      {membersPreview?.length > 0 && (
        <div className={styles.members}>
          <Text
            type="text1"
            className={styles.note}
          >
            {Translate({
              context: "series_page",
              label: "parts_in_series",
              vars: [membersPreview.length],
            })}
          </Text>
          <div className={styles.thumbs}>
            {membersPreview.map(
              (
                {
                  key,
                  title: memberTitle,
                  number,
                  image,
                  workId,
                  traceId: memberTraceId,
                  creators,
                },
                idx
              ) => {
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
                        {/**TODO: use next image? */}
                        <img
                          src={image}
                          alt={memberTitle || ""}
                          className={styles.thumbImage}
                        />
                      </div>
                      <span className={styles.thumbNumber}>
                        {number || `#${idx + 1}`}
                      </span>
                    </div>
                  </Link>
                );
              }
            )}
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

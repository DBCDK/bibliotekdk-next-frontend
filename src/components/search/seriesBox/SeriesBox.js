import PropTypes from "prop-types";

import Link from "@/components/base/link";
import { getSeriesUrl, getWorkUrl } from "@/lib/utils";
import Text from "@/components/base/text/Text";
import styles from "./SeriesBox.module.css";

const MEMBERS_PREVIEW_LIMIT = 3;

function resolveTitle(titleField) {
  if (!titleField) {
    return null;
  }
  return Array.isArray(titleField) ? titleField[0] : titleField;
}

function buildMembersPreview(members = []) {
  return members
    ?.slice(0, MEMBERS_PREVIEW_LIMIT)
    .map((member, idx) => {
      const work = member?.work;
      const title = resolveTitle(work?.titles?.main);
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
    identifyingAddition,
    hitcount,
    alternativeTitles,
    parallelTitles,
    mainLanguages,
    workTypes,
    readThisFirst,
    readThisWhenever,
    isPopular,
    members,
    seriesId,
    traceId,
  } = seriesHit;

  const seriesLink = seriesId ? getSeriesUrl(seriesId, traceId) : null;

  const membersPreview = buildMembersPreview(members);

  return (
    <section className={`${styles.block} ${className}`} data-cy={dataCy}>
      {title ? (
        <div className={styles.headerRow}>
          {title ? <h3 className={styles.title}>{title}</h3> : null}
        </div>
      ) : null}

      {description ? <p className={styles.description}>{description}</p> : null}

      {membersPreview?.length > 0 ? (
        <div className={styles.members}>
          <Text
            type="text1"
            className={styles.note}
          >{`Der er ${membersPreview.length} bøger i serien`}</Text>
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
                        <img
                          src={image}
                          alt={memberTitle || `Seriemedlem ${idx + 1}`}
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
      ) : null}

      {seriesLink ? (
        <Link
          href={seriesLink}
          className={styles.seeAllLink}
          border={{ bottom: { keepVisible: true } }}
        >
          Se hele serien
        </Link>
      ) : null}
    </section>
  );
}

SeriesBox.propTypes = {
  seriesHit: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    identifyingAddition: PropTypes.string,
    hitcount: PropTypes.number,
    alternativeTitles: PropTypes.arrayOf(PropTypes.string),
    parallelTitles: PropTypes.arrayOf(PropTypes.string),
    mainLanguages: PropTypes.arrayOf(PropTypes.string),
    workTypes: PropTypes.arrayOf(PropTypes.string),
    readThisFirst: PropTypes.bool,
    readThisWhenever: PropTypes.bool,
    isPopular: PropTypes.bool,
    seriesId: PropTypes.string,
    traceId: PropTypes.string,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        numberInSeries: PropTypes.string,
        work: PropTypes.shape({
          workId: PropTypes.string,
          traceId: PropTypes.string,
          titles: PropTypes.shape({
            main: PropTypes.oneOfType([
              PropTypes.arrayOf(PropTypes.string),
              PropTypes.string,
            ]),
          }),
          creators: PropTypes.arrayOf(
            PropTypes.shape({
              display: PropTypes.string,
            })
          ),
          manifestations: PropTypes.shape({
            mostRelevant: PropTypes.oneOfType([
              PropTypes.arrayOf(
                PropTypes.shape({
                  cover: PropTypes.shape({
                    detail: PropTypes.string,
                  }),
                })
              ),
              PropTypes.shape({
                cover: PropTypes.shape({
                  detail: PropTypes.string,
                }),
              }),
            ]),
          }),
        }),
      })
    ),
  }),
  className: PropTypes.string,
  "data-cy": PropTypes.string,
};

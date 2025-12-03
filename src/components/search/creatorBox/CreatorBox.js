import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import styles from "./CreatorBox.module.css";
import Text from "@/components/base/text";

/**
 * CreatorBox component for displaying creator information in search results
 */
export default function CreatorBox({
  creatorHit,
  className = "",
  "data-cy": dataCy,
}) {
  if (!creatorHit) {
    return null;
  }
  const summary =
    creatorHit?.generated?.shortSummary?.text ||
    creatorHit?.generated?.summary?.text ||
    creatorHit?.generated?.dataSummary?.text;
    
  const name =
    creatorHit?.display ||
    [creatorHit?.firstName, creatorHit?.lastName].filter(Boolean).join(" ");
  // const role = Array.isArray(creatorHit?.wikidata?.occupation)
  //   ? creatorHit.wikidata.occupation[0]
  //   : creatorHit?.wikidata?.occupation;
  const maxAwardsToShow = 3;
  const displayedAwards = (
    Array.isArray(creatorHit?.wikidata?.awards)
      ? creatorHit.wikidata.awards
      : []
  ).slice(0, maxAwardsToShow);
  const extraAwardsCount =
    (Array.isArray(creatorHit?.wikidata?.awards)
      ? creatorHit.wikidata.awards.length
      : 0) > maxAwardsToShow
      ? (Array.isArray(creatorHit?.wikidata?.awards)
          ? creatorHit.wikidata.awards.length
          : 0) - maxAwardsToShow
      : 0;

  return (
    <section className={`${styles.block} ${className}`} data-cy={dataCy}>
      {(creatorHit?.forfatterweb?.image?.medium?.url ||
        creatorHit?.wikidata?.image?.medium) && (
        <div className={styles.portraitWrapper}>
          <img
            src={
              creatorHit?.forfatterweb?.image?.medium?.url ||
              creatorHit?.wikidata?.image?.medium
            }
            alt={creatorHit?.display || ""}
            className={styles.portrait}
          />
        </div>
      )}

      {creatorHit?.display && (
        <Text type="title3" tag="h3" className={styles.title}>
          {creatorHit.display}
        </Text>
      )}
      {creatorHit?.wikidata?.description?.length > 0 && (
        <Text type="text2" className={styles.role}>
          {creatorHit?.wikidata?.description?.charAt(0)?.toUpperCase() +
            creatorHit?.wikidata?.description?.slice(1)}
        </Text>
      )}

      {summary && (
        <Text type="text2" className={styles.description}>
          {summary}
        </Text>
      )}

      {displayedAwards?.length > 0 && (
        <div className={styles.facts}>
          <Text type="text3" tag="span" className={styles.factLabel}>
            <Translate context="creator" label="awards" />
          </Text>{" "}
          {displayedAwards.map((award, idx) => (
            <Text
              key={`${award}-${idx}`}
              type="text3"
              tag="span"
              className={styles.fact}
            >
              {award}
              {idx < displayedAwards.length - 1 || extraAwardsCount > 0
                ? ", "
                : ""}
            </Text>
          ))}
          {extraAwardsCount > 0 && (
            <Text
              type="text3"
              tag="span"
              className={`${styles.fact} ${styles.extraFact}`}
            >
              {`+${extraAwardsCount}`}
            </Text>
          )}
        </div>
      )}

      <Link
        href={
          creatorHit?.display
            ? `/ophav/${encodeURIComponent(creatorHit.display)}`
            : "#"
        }
        border={{ bottom: { keepVisible: true } }}
        className={styles.linkRow}
      >
        {Translate({
          context: "creator",
          label: "more_about",
          vars: [name],
        })}
      </Link>
    </section>
  );
}

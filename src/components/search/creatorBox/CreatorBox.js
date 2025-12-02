import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import styles from "./CreatorBox.module.css";

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
  const name =
    creatorHit?.display ||
    [creatorHit?.firstName, creatorHit?.lastName].filter(Boolean).join(" ");
  const role = Array.isArray(creatorHit?.wikidata?.occupation)
    ? creatorHit.wikidata.occupation[0]
    : creatorHit?.wikidata?.occupation;
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
        <h3 className={styles.title}>{creatorHit.display}</h3>
      )}
      {role && <div className={styles.role}>{role}</div>}

      {(creatorHit?.generated?.shortSummary?.text ||
        creatorHit?.generated?.summary?.text) && (
        <p className={styles.description}>
          {creatorHit?.generated?.shortSummary?.text ||
            creatorHit?.generated?.summary?.text}
        </p>
      )}

      <div className={styles.facts}>
        <span className={styles.factLabel}>
          <Translate context="creator" label="awards" />
        </span>{" "}
        {displayedAwards.map((award, idx) => (
          <span key={`${award}-${idx}`} className={styles.fact}>
            {award}
            {idx < displayedAwards.length - 1 || extraAwardsCount > 0
              ? ", "
              : ""}
          </span>
        ))}
        {extraAwardsCount > 0 && (
          <span className={`${styles.fact} ${styles.extraFact}`}>
            {`+${extraAwardsCount}`}
          </span>
        )}
      </div>

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

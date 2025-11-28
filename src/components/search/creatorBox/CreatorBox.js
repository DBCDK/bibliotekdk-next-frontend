import Icon from "@/components/base/icon/Icon";
import Link from "@/components/base/link";

import styles from "./CreatorBox.module.css";
//TODO: pass one creator object instead of individual props
//TODO make storybook?
export default function CreatorBox({
  creatorHit,
  seeAllHref,
  onSeeAll,
  moreLabel,
  moreHref,
  moreExternal = true,
  relatedTitle,
  relatedLinks = [],
  className = "",
  "data-cy": dataCy,
}) {
  
  if (!creatorHit) {
    return null;
  }
  const display = creatorHit?.display;
  const role = Array.isArray(creatorHit?.wikidata?.occupation)
    ? creatorHit.wikidata.occupation[0]
    : creatorHit?.wikidata?.occupation;
  const body =
    creatorHit?.generated?.shortSummary?.text ||
    creatorHit?.generated?.summary?.text;
  const imageUrl =
    creatorHit?.forfatterweb?.image?.medium?.url ||
    creatorHit?.wikidata?.image?.medium;
  const imageAlt = creatorHit?.display || "";

  const fullName = `${creatorHit?.firstName} ${creatorHit?.lastName}`;
  const profileHref = display ? `/ophav/${encodeURIComponent(display)}` : "#";

  const awards = Array.isArray(creatorHit?.wikidata?.awards)
    ? creatorHit.wikidata.awards
    : [];
  const maxAwardsToShow = 3;
  const displayedAwards = awards.slice(0, maxAwardsToShow);
  const extraAwardsCount =
    awards.length > maxAwardsToShow ? awards.length - maxAwardsToShow : 0;
  return (
    <section className={`${styles.block} ${className}`} data-cy={dataCy}>
      {imageUrl ? (
        <div className={styles.portraitWrapper}>
          <img src={imageUrl} alt={imageAlt} className={styles.portrait} />
        </div>
      ) : null}

      {display ? <h3 className={styles.title}>{display}</h3> : null}
      {role ? <div className={styles.role}>{role}</div> : null}



      {body ? <p className={styles.description}>{body}</p> : null}

      <div className={styles.facts}>
        <span className={styles.factLabel}>Priser:</span>{" "}
        {displayedAwards.map((award, idx) => (
          <span key={`${award}-${idx}`} className={styles.fact}>
            {award}
            {idx < displayedAwards.length - 1 || extraAwardsCount > 0
              ? ", "
              : ""}
          </span>
        ))}
        {extraAwardsCount > 0 ? (
          <span className={`${styles.fact} ${styles.extraFact}`}>
            {`+${extraAwardsCount}`}
          </span>
        ) : null}
      </div>

      {moreLabel && moreHref ? (
        <div className={styles.moreRow}>
          <Link href={moreHref} border={{ bottom: { keepVisible: true } }}>
            {moreLabel}
          </Link>
          {moreExternal ? (
            <Icon src="external.svg" size={1} className={styles.externalIcon} />
          ) : null}
        </div>
      ) : null}

      {relatedTitle || (relatedLinks && relatedLinks.length > 0) ? (
        <div className={styles.related}>
          {relatedTitle ? (
            <div className={styles.relatedTitle}>{relatedTitle}</div>
          ) : null}
          {Array.isArray(relatedLinks) && relatedLinks.length > 0 ? (
            <div className={styles.relatedLinks}>
              {relatedLinks.map((rl, idx) => (
                <span key={`${rl.label}-${idx}`} className={styles.relatedItem}>
                  <Link
                    href={rl?.href || "#"}
                    border={{ bottom: { keepVisible: true } }}
                  >
                    {rl?.label}
                  </Link>
                  {idx < relatedLinks.length - 1 ? (
                    <span className={styles.separator}>,</span>
                  ) : null}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <Link
        href={profileHref}
        border={{ bottom: { keepVisible: true } }}
        className={styles.linkRow}
      >
        {`Mere om ${fullName}`}
      </Link>
    </section>
  );
}

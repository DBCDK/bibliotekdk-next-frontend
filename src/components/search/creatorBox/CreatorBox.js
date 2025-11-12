import Icon from "@/components/base/icon/Icon";
import Link from "@/components/base/link";

import styles from "./CreatorBox.module.css";
//TODO: pass one creator object instead of individual props
//TODO make storybook? 
export default function CreatorBox({
  imageUrl,
  imageAlt = "",
  title,
  role,
  seeAllLabel,
  seeAllHref,
  onSeeAll,
  body,
  facts = [],
  moreLabel,
  moreHref,
  moreExternal = true,
  relatedTitle,
  relatedLinks = [],
  className = "",
  "data-cy": dataCy,
}) {
  return (
    <section className={`${styles.block} ${className}`} data-cy={dataCy}>
      {imageUrl ? (
        <div className={styles.portraitWrapper}>
          <img src={imageUrl} alt={imageAlt} className={styles.portrait} />
        </div>
      ) : null}

      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {role ? <div className={styles.role}>{role}</div> : null}


        <div className={styles.linkRow}>
          <Link
            href={seeAllHref || "#"}
            onClick={onSeeAll}
            border={{ bottom: { keepVisible: true } }}
          >
            {"Se alle udgivelser"}
          </Link>
        </div>


      {body ? <p className={styles.description}>{body}</p> : null}

      {Array.isArray(facts) && facts.length > 0 ? (
        <div className={styles.facts}>
          {facts.map((fact, idx) =>
            fact?.label || fact?.value ? (
              <p key={`${fact.label || "fact"}-${idx}`} className={styles.fact}>
                {fact?.label ? (
                  <span className={styles.factLabel}>{fact.label}</span>
                ) : null}
                {fact?.value ? <span>{fact.value}</span> : null}
              </p>
            ) : null
          )}
        </div>
      ) : null}

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
    </section>
  );
}



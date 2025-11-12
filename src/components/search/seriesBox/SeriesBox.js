import Icon from "@/components/base/icon/Icon";
import Button from "@/components/base/button";
import Link from "@/components/base/link";

import styles from "./SeriesBox.module.css";
//TODO: pass one series object instead of individual props
export default function SeriesBox({
  title,
  description, 
  icon, 
  actionLabel,
  onAction,
  imageUrl,
  subtitle,
  body, 
  note, 
  thumbnails = [], 
  linkLabel,
  onLink,
  href,
  className = "",
  "data-cy": dataCy,
}) {
  return (
    <section className={`${styles.block} ${className}`} data-cy={dataCy}>
      {/* {imageUrl && (
        <div className={styles.topImageWrapper}>
          <img src={imageUrl} alt="" className={styles.topImage} />
        </div>
      )} */}

      <header className={styles.header}>
        {icon ? <Icon src={icon} size={2} className={styles.icon} /> : null}
        {title ? <h3 className={styles.title}>{title}</h3> : null}
      </header>

      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

      {body || description ? (
        <p className={styles.description}>{body || description}</p>
      ) : null}

      {note ? (
        <p className={styles.note}>
          {note}
        </p>
      ) : null}

      {thumbnails?.length > 0 && (
        <div className={styles.thumbs}>
          {thumbnails.slice(0, 3).map((src, idx) => (
            <div key={`${src}-${idx}`} className={styles.thumb}>
              <div className={styles.thumbImageWrapper}>
                <img src={src} alt="" className={styles.thumbImage} />
              </div>
              <span className={styles.thumbIndex}>{idx + 1}</span>
            </div>
          ))}
        </div>
      )}

      {actionLabel && onAction ? (
        <div className={styles.actions}>
          <Button
            type="primary"
            size="medium"
            onClick={onAction}
            className={styles.actionButton}
          >
            {actionLabel}
          </Button>
        </div>
      ) : linkLabel ? (
        <div className={styles.linkRow}>
          <Link
            href={href || "#"}
            onClick={onLink}
            border={{ bottom: { keepVisible: true } }}
          >
            {linkLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}



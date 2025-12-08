import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import styles from "./CreatorBox.module.css";
import Text from "@/components/base/text";
import Cover from "@/components/base/cover/Cover";
import { useRouter } from "next/router";

function formatOccupation(items) {
  const max = 3;
  if (!Array.isArray(items)) return null;
  const list = items.slice(0, max);

  if (list.length === 0) return null;

  const andWord = Translate({ context: "general", label: "and" });

  if (list.length === 1) {
    const only = list[0] ?? "";
    return only.charAt(0).toUpperCase() + only.slice(1);
  }

  const allButLast = list.slice(0, -1);
  const last = list[list.length - 1] ?? "";

  const base =
    allButLast.length === 1
      ? `${allButLast[0]} ${andWord} ${last}`
      : `${allButLast.join(", ")} ${andWord} ${last}`;

  return base.charAt(0).toUpperCase() + base.slice(1);
}

/**
 * CreatorBox component for displaying creator information in search results
 */
export default function CreatorBox({
  creatorHit,
  className = "",
  dataCy: dataCy,
  isLoading = false,
}) {
  const router = useRouter();
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
  const occupation = formatOccupation(creatorHit?.wikidata?.occupation);
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
      {creatorHit?.forfatterweb?.image?.medium?.url && (
        <div className={styles.portraitWrapper}>
          <Cover
            src={creatorHit?.forfatterweb?.image?.medium?.url}
            alt={"creatorData?.display"}
            skeleton={
              isLoading && !creatorHit?.forfatterweb?.image?.medium?.url
            }
            size="fill"
            onClick={() => {
              router.push(`/ophav/${encodeURIComponent(creatorHit.display)}`);
            }}
          />
          <Text
            type="text5"
            tag="p"
            className={styles.attribution}
            lines={2}
            clamp
          >
            Forfatterweb.dk
          </Text>
        </div>
      )}

      {creatorHit?.display && (
        <Text type="title3" tag="h3" className={styles.title}>
          {creatorHit.display}
        </Text>
      )}

      {occupation && (
        <Text type="text2" className={styles.role}>
          {occupation}
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

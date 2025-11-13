/**
 * @file DidYoumean component
 * Show an alternative to search if relevant - that is if did you mean service finds a good alternative.
 */

import useQ from "@/components/hooks/useQ";
import { useData } from "@/lib/api/api";
import { didYouMean } from "@/lib/api/search.fragments";
import Section from "@/components/base/section";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import translate from "@/components/base/translate";
import styles from "./DidYouMean.module.css";

export function DidYouMean({ data, isLoading }) {
  const { q, mode, setQuery } = useQ();

  if (isLoading) {
    return null;
  }

  if (!data) {
    return null;
  }

  // we show limited results (one for now), and only if the score is high
  // definition of high score
  const highscore = 0.9;
  // number of results to show
  const numberToShow = 1;

  // filter out result with low score
  let results = data?.filter((did) => Number(did.score) > highscore);
  if (results?.length < 1) {
    return null;
  }

  // slice to wanted limit
  if (results?.length > numberToShow) {
    results = results?.slice(0, numberToShow);
  }

  return (
    <Section
      divider={false}
      className={styles.section}
      space={{
        bottom: "var(--pt4)",
      }}
      title={null}
    >
      <Text skeleton={isLoading} lines={1} tag="span">
        {translate({ context: "search", label: "didyoumean" })}:
      </Text>
      {results?.map((res, index) => (
        <span className={styles.result} key={index}>
          <Link
            dataCy="did-you-mean-result"
            onClick={(e) => {
              e.preventDefault();
              setQuery({
                include: { all: res.query },
                query: {
                  workTypes: null,
                  mode,
                  tid: res.traceId,
                },
                method: "push",
              });
            }}
            disabled={isLoading}
            border={{ bottom: { keepVisible: true } }}
          >
            <Text skeleton={isLoading} lines={1} tag="span">
              <HiglightChanges q={q} suggestion={res.query} />
            </Text>
          </Link>
        </span>
      ))}
    </Section>
  );
}

/**
 * Higlight words in suggestion that are different from querystring.
 * @param q
 * @param suggestion
 * @returns {*}
 */
function HiglightChanges({ q, suggestion }) {
  const suggestionparts = suggestion?.split(" ");
  const queryparts = q?.all?.split(" ");
  return (
    <span>
      {suggestionparts?.map((part, index) => {
        if (!queryparts?.includes(part)) {
          return (
            <span key={index} className={styles.highlight}>
              {`${part} `}
            </span>
          );
        } else {
          return <span key={index}> {part} </span>;
        }
      })}
    </span>
  );
}

function parseDidYouMean(searchresponse) {
  return searchresponse?.search?.didYouMean;
}

export default function Wrap() {
  const q = useQ().getQuery();

  // limit for query
  const limit = 5;
  // use the usedata hook to get data
  const { isLoading, data } = useData(didYouMean({ q: q, limit: limit }));

  return <DidYouMean data={parseDidYouMean(data)} isLoading={isLoading} />;
}

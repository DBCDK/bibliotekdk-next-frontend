import useQ from "@/components/hooks/useQ";

import { useData } from "@/lib/api/api";
import { didYouMean } from "@/lib/api/search.fragments";

import Section from "@/components/base/section";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
export function DidYouMean({ didyoumean, isLoading }) {
  const { setQuery } = useQ();

  if (isLoading) {
    return null;
  }
  // we show limited results (one for now), and only if the score is high
  // definition of high score
  const highscore = 0.5;
  // number of results to show
  const numberToShow = 1;

  // filter out result with low score
  let results = didyoumean.filter((did) => Number(did.score) > highscore);
  if (results.length < 1) {
    return null;
  }

  // slice to wanted limit
  if (results.length > numberToShow) {
    results = results.slice(0, numberToShow);
  }

  return (
    <Section
      // className={`${styles.section} `}
      divider={false}
      space={{
        bottom: "var(--pt4)",
      }}
      title={<span />}
    >
      {results.map((res, index) => (
        <Link
          key={index}
          onClick={(e) => {
            e.preventDefault();
            setQuery({
              include: { all: res.query },
              query: {
                workTypes: null,
              },
              method: "push",
            });
          }}
          disabled={isLoading}
          border={{ bottom: { keepVisible: true } }}
        >
          <Text skeleton={isLoading} lines={1} tag="span">
            {res.query}
          </Text>
        </Link>
      ))}
    </Section>
  );
}

function parseDidYouMean(searchresponse) {
  return searchresponse?.search?.didYouMean;
}

export default function Wrap({ q }) {
  // limit for query
  const limit = 5;
  // use the usedata hook to get data
  const { isLoading, data } = useData(didYouMean({ q: q, limit: limit }));
  console.log(data, "DIDYOUMEAN DATA");
  return (
    <DidYouMean didyoumean={parseDidYouMean(data)} isLoading={isLoading} />
  );
}

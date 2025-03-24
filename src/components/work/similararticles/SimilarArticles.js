import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

import { PeriodicaIssuByWork } from "@/lib/api/periodica.fragments";

import { useMemo } from "react";
import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import MaterialCard from "@/components/base/materialcard/MaterialCard";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function SimilarArticles({ periodicaTitle, works }) {
  const sorted = useMemo(() => {
    if (works) {
      return [...works]
        .sort(
          (a, b) =>
            new Date(b.latestPublicationDate) -
            new Date(a.latestPublicationDate)
        )
        ?.map((work) => ({
          ...work,
          cover: work?.manifestations?.mostRelevant?.[0]?.cover,
          materialTypesArray:
            work?.manifestations?.mostRelevant?.[0]?.hostPublication?.issue,
        }));
    }
  }, [works]);

  const title = Translate({
    context: "similararticles",
    label: "title",
    vars: [periodicaTitle],
  });

  return (
    <Section
      title={title}
      sectionTag="div" // Section sat in parent
    >
      <ScrollSnapSlider sliderId={"similar-articles-slider"}>
        {sorted?.map((work) => {
          return (
            <MaterialCard key={work?.workId} propAndChildrenInput={work} />
          );
        })}
      </ScrollSnapSlider>
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function SimilarArticlesSkeleton(props) {
  const data = [];

  return (
    <SimilarArticles
      {...props}
      data={data}
      className={`${props.className}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const { workId } = props;

  const { data, isLoading, error } = useData(
    PeriodicaIssuByWork({ id: workId })
  );

  if (isLoading) {
    return <SimilarArticlesSkeleton />;
  }

  if (error) {
    return null;
  }

  if (!data?.work?.periodicaInfo?.similarArticles?.length) {
    return null;
  }

  return (
    <SimilarArticles
      periodicaTitle={data?.work?.periodicaInfo?.parent?.titles?.main}
      className={props.className}
      skeleton={false}
      works={data?.work?.periodicaInfo?.similarArticles?.map(
        (entry) => entry.work
      )}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};

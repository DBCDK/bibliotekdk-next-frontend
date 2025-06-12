import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

import { PeriodicaIssuByWork } from "@/lib/api/periodica.fragments";

import { useMemo } from "react";
import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import styles from "./SimilarArticles.module.css";
import Text from "@/components/base/text";

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
    label: "unspecificTitle",
  });

  const subtitle = (
    <Text type="text2" lines={4} clamp={true}>
      {Translate({
        context: "similararticles",
        label: "in",
      })}{" "}
      {periodicaTitle}
    </Text>
  );

  return (
    <Section
      className={styles.section}
      title={title}
      subtitle={subtitle}
      sectionTag="div" // Section sat in parent
      divider={false}
      backgroundColor="var(--concrete)"
      space={{ bottom: "var(--pt6)" }}
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

  if (!data?.work?.extendedWork?.similarArticles?.length) {
    return null;
  }

  return (
    <SimilarArticles
      periodicaTitle={data?.work?.extendedWork?.parentPeriodical?.titles?.main}
      className={props.className}
      skeleton={false}
      works={data?.work?.extendedWork?.similarArticles?.map(
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

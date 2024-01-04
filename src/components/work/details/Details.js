import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";
import * as universeFragments from "@/lib/api/universe.fragments";
import styles from "./Details.module.css";
import { useMemo } from "react";

import {
  flattenMaterialType,
  formatMaterialTypesToPresentation,
  inFlatMaterialTypes,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";

import { fieldsForRows } from "@/components/work/details/utils/details.utils";

// TODO: Use when jed data is ready and better
// import { workRelationsWorkTypeFactory } from "@/lib/workRelationsWorkTypeFactoryUtils";
import Tooltip from "@/components/base/tooltip";

function DefaultDetailValues({ values }) {
  return (
    <Text tag="div" type="text4" lines={2}>
      {values}
    </Text>
  );
}

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
function Details({ className = "", manifestation = {}, work = {} }) {
  // Translate Context
  const context = { context: "details" };

  // this materialtype is for displaying subtitle in section (seneste udgave)
  const materialType = formatMaterialTypesToPresentation(
    flattenMaterialType(manifestation)
  );
  const subtitle = Translate({
    ...context,
    label: "subtitle",
    vars: [materialType],
  });

  const fieldsToShow = useMemo(() => {
    return fieldsForRows(manifestation, work, context);
  }, [manifestation, materialType, work, context]);

  //const fieldsToShow = fieldsForRows(manifestation, work, context);
  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      space={{ top: false, bottom: "var(--pt4)" }}
      className={`${className}`}
      subtitle={subtitle}
    >
      <Row className={`${styles.details}`}>
        <Col xs={12}>
          <div className={styles.container}>
            {fieldsToShow &&
              fieldsToShow.map((field, index) => {
                const fieldName = Object.keys(field)[0];

                return (
                  !isEmpty(field[fieldName].value) && (
                    // this is the label
                    <div className={styles.item} key={index}>
                      <Text
                        type="text3"
                        className={`${styles.title} ${
                          field[fieldName]?.tooltip ? styles.txtInline : ""
                        }`}
                        lines={2}
                        tag="span"
                      >
                        {field[fieldName].label}
                      </Text>
                      {/** some labels has a tooltip attached .. **/}
                      {field[fieldName]?.tooltip && (
                        <Tooltip
                          labelToTranslate={field[fieldName].tooltip}
                          customClass={styles.tooltipinline}
                        ></Tooltip>
                      )}
                      {/** some fields has a custom jsx parser .. **/}
                      {field?.[fieldName]?.jsxParser ? (
                        field?.[fieldName]?.jsxParser({
                          values: field?.[fieldName]?.value,
                        })
                      ) : (
                        <DefaultDetailValues
                          values={field?.[fieldName]?.value}
                        />
                      )}
                    </div>
                  )
                );
              })}
          </div>
        </Col>
      </Row>
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @returns {React.JSX.Element}
 */
export function DetailsSkeleton() {
  const texts = [1, 2, 3, 4, 5, 6];
  return (
    <Section
      title={Translate({ context: "details", label: "title" })}
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
      subtitle=" ... "
    >
      <Row className={`${styles.details}`}>
        {texts.map((txt) => (
          <Col xs={6} md={3} key={`skeleton-${txt}`}>
            <Text
              type="text3"
              className={styles.title}
              lines={2}
              skeleton={true}
            >
              ...
            </Text>
          </Col>
        ))}
      </Row>
    </Section>
  );
}

/**
 * Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const { workId, type } = props;
  const {
    data,
    isLoading: overViewIsLoading,
    error,
  } = useData(workId && workFragments.fbiOverviewDetail({ workId: workId }));

  // TODO: Use when jed data is ready and better
  // const {
  //   data: relationData,
  //   isLoading: relationsIsLoading,
  //   error: relationsError,
  // } = useData(
  //   workId &&
  //     workFragments.workForWorkRelationsWorkTypeFactory({ workId: workId })
  // );

  // TODO: Use when jed data is ready and better
  // const { groupedRelations } = workRelationsWorkTypeFactory(relationData?.work);

  const {
    data: seriesData,
    isLoading: seriesIsLoading,
    error: seriesError,
  } = useData(
    workId &&
      workFragments.series({
        workId: workId,
        seriesLimit: 1,
      })
  );

  const {
    data: universesData,
    isLoading: universesIsLoading,
    error: universesError,
  } = useData(
    workId &&
      universeFragments.universes({
        workId: workId,
        worksLimit: 1,
        seriesLimit: 1,
      })
  );

  const manifestations = data?.work?.manifestations?.mostRelevant;

  // find the selected materialType (manifestation), use first manifestation as fallback
  const manifestationByMaterialType = manifestations?.find((manifestation) => {
    return inFlatMaterialTypes(type, flattenMaterialType(manifestation));
  });

  const work = {
    ...data?.work,
    series: seriesData?.work?.series || [],
    seriesIsLoading: seriesIsLoading,
    universes: universesData?.work?.universes || [],
    universesIsLoading: universesIsLoading,
  };

  // attach relations for manifestation to display
  if (manifestationByMaterialType) {
    // TODO: Use when jed data is ready and better
    // manifestationByMaterialType.relations = groupedRelations;
  }

  if (
    !overViewIsLoading &&
    isEmpty(manifestationByMaterialType) &&
    !error
    // TODO: Use when jed data is ready and better
    // &&
    // !relationsIsLoading &&
    // !relationsError
  ) {
    return <></>;
  }

  if (
    error ||
    seriesError ||
    universesError
    // TODO: Use when jed data is ready and better
    // relationsError ||
  ) {
    return <></>;
  }

  if (
    overViewIsLoading ||
    seriesIsLoading ||
    universesIsLoading
    // TODO: Use when jed data is ready and better
    // relationsIsLoading ||
  ) {
    return <DetailsSkeleton />;
  }

  return (
    <Details
      {...props}
      manifestation={manifestationByMaterialType}
      work={work}
      skeleton={
        overViewIsLoading
        // TODO: Use when jed data is ready and better
        // || relationsIsLoading
      }
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};

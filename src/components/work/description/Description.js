import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import styles from "./Description.module.css";
import isEmpty from "lodash/isEmpty";

/**
 * Parse creators array to see if description should include information
 * about people interviewing and/or being interviewed.
 * @param creators
 * @returns {string}
 */
function parseCreatorsForInterview(creators) {
  if (isEmpty(creators)) {
    return "";
  }
  // person(s) being interviewed
  const interviewee = creators
    .filter((creator) => creator?.roles?.[0]?.functionCode === "ive")
    .map((creator) => creator.display);
  // if there are more persons we want the last person to be seperated with "og"
  // like: "jens, peter og hans"
  let intervieweeAsString = "";
  if (interviewee.length > 1) {
    const last = interviewee.pop();
    intervieweeAsString = interviewee.join(", ") + " og " + last;
  } else {
    intervieweeAsString = interviewee.join(", ");
  }

  // person(s) interviewing
  const interviewer = creators
    .filter((creator) => creator?.roles?.[0]?.functionCode === "ivr")
    .map((creator) => creator.display)
    .join(", ");

  return (
    `${intervieweeAsString ? `Interview med  ${intervieweeAsString} ` : ""}` +
    `${interviewer ? `af  ${interviewer}` : ""}`
  );
}

/**
 * Check if a note in manifestations holds relevant info ( type:OCCASION_FOR_PUBLICATION )
 * @param manifestations
 * @returns {*|string}
 */
function parseForOccasion(manifestations) {
  const occasions = manifestations?.bestRepresentation?.notes?.filter(
    (note) => {
      return note.type === "OCCASION_FOR_PUBLICATION";
    }
  );
  // if there are more than one occasion - simply return the first
  return occasions?.[0]?.display || "";
}

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function Description({ className = "", data = "", skeleton = false }) {
  const abstract = data?.abstract?.map((abs, index) => (
    <div
      key={index}
      className={index < data?.abstract?.length - 1 ? styles.chapter : ""}
    >
      {abs}
    </div>
  ));

  const occasion = parseForOccasion(data?.manifestations);
  const preAbstract = parseCreatorsForInterview(data?.creators);

  if (!(!isEmpty(abstract) || occasion || preAbstract)) {
    return null;
  }
  // Translate Context
  const context = { context: "description" };

  return (
    <Section title={Translate({ ...context, label: "title" })}>
      <Row className={`${styles.description} ${className}`}>
        {(!isEmpty(abstract) || preAbstract || occasion) && (
          <Col xs={12} md={8}>
            {occasion && (
              <Text
                dataCy={"predescription"}
                type="text2"
                skeleton={skeleton}
                lines={4}
              >
                {occasion}.
              </Text>
            )}
            {preAbstract && (
              <Text
                dataCy={"predescription"}
                type="text2"
                skeleton={skeleton}
                lines={4}
              >
                {preAbstract}.
              </Text>
            )}
            {!isEmpty(abstract) && (
              <Text
                dataCy={"description"}
                type="text2"
                skeleton={skeleton}
                lines={4}
                tag="span"
              >
                {abstract}
              </Text>
            )}
          </Col>
        )}
      </Row>
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
export function DescriptionSkeleton(props) {
  return (
    <Description
      {...props}
      data="..."
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
    workFragments.description({ workId })
  );

  if (error) {
    return null;
  }

  if (isLoading) {
    return <DescriptionSkeleton />;
  }

  return <Description {...props} data={data?.work} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};

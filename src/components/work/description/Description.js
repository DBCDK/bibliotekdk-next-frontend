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
    `${interviewee ? `Interview med  ${intervieweeAsString} ` : ""}` +
    `${interviewer ? `af  ${interviewer}` : ""}`
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Description({ className = "", data = "", skeleton = false }) {
  if (!data?.abstract || data?.abstract?.length === 0) {
    return null;
  }
  const abstract = data?.abstract?.join(", ");
  const preAbstract = parseCreatorsForInterview(data?.creators);
  // Translate Context
  const context = { context: "description" };

  return (
    <Section title={Translate({ ...context, label: "title" })}>
      <Row className={`${styles.description} ${className}`}>
        {abstract && (
          <Col xs={12} md={8}>
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
            {abstract && (
              <Text
                dataCy={"description"}
                type="text2"
                skeleton={skeleton}
                lines={4}
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
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function DescriptionSkeleton(props) {
  return (
    <Description
      {...props}
      data="..."
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { workId } = props;

  const { data, isLoading, error } = useData(
    workFragments.description({ workId })
  );

  if (isLoading) {
    return <DescriptionSkeleton />;
  }

  if (error) {
    return null;
  }

  return <Description {...props} data={data?.work} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};

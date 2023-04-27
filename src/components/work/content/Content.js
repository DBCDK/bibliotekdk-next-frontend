import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Content.module.css";
import { useMemo } from "react";
import isEqual from "lodash/isEqual";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";
import { useModal } from "@/components/_modal";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Content({ className = "", data = {}, skeleton = false }) {
  const modal = useModal();

  if (!data?.tableOfContents?.listOfContent?.length) {
    return null;
  }
  // Translate Context
  const context = { context: "content" };

  const numberToShow = 15;

  const morecontent = data?.tableOfContents?.listOfContent?.map((n, i) => {
    return {
      title: n?.content,
    };
  });
  const pid = data?.pid;
  console.log(data, "DATA");
  console.log(morecontent, "MoreconTENT");

  const contentToShow = data?.tableOfContents?.listOfContent?.slice(
    0,
    numberToShow
  );

  const modalOpen = () => {
    modal.push("manifestationContent", {
      pid: null,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButton: false,
      parts: morecontent,
    });
  };

  return (
    <Section title={Translate({ ...context, label: "title" })}>
      <Row className={`${styles.content} ${className}`}>
        {contentToShow?.map((n, i) => {
          return (
            <Col key={n.content + i} xs={12}>
              <Text type="text3" skeleton={skeleton} lines={8}>
                {n.content}
              </Text>
            </Col>
          );
        })}
      </Row>
      <div onClick={() => modalOpen()}>FISK</div>
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
export function ContentSkeleton(props) {
  return (
    <Content
      {...props}
      data={{ tableOfContents: { listOfContent: ["..."] } }}
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
  const { workId, type } = props;

  const { data, isLoading, error } = useData(
    workFragments.tableOfContents({ workId })
  );

  // Find manifestation of the right type that contains tableOfContents
  const manifestation = useMemo(() => {
    return data?.work?.manifestations?.mostRelevant?.find(
      (manifestation) =>
        manifestation?.tableOfContents &&
        isEqual(flattenMaterialType(manifestation), type)
    );
  }, [data]);

  if (error) {
    return null;
  }
  if (isLoading) {
    return <ContentSkeleton {...props} />;
  }

  return <Content {...props} data={manifestation} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};

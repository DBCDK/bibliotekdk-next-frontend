import { useMemo } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";

import { cyKey } from "@/utils/trim";
import { encodeTitleCreator } from "@/lib/utils";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import useBreakpoint from "@/components/hooks/useBreakpoint";

import { dateToShortDate } from "@/utils/datetimeConverter";

import styles from "./MaterialReview.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function MaterialReview({
  className = "",
  data = [],
  skeleton = false,
  onFocus = null,
}) {
  // Translate Context
  const context = { context: "reviews" };

  return (
    <Col
      xs={12}
      className={`${styles.materialReview} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "material" })}
    >
      <Row>
        <Col xs={12} md={10}>
          <Row>
            <Col xs={12} className={styles.date}>
              <Title type="title5" skeleton={skeleton}>
                {data.date && dateToShortDate(data.date)}
              </Title>
            </Col>
          </Row>

          <Col xs={12} className={styles.content}>
            <LectorReview data={data} skeleton={skeleton} />
          </Col>

          <Col xs={12}>
            <Row>
              <Col xs={12} md={8}>
                <Row>
                  <Col className={styles.type}>
                    <Text type="text3" skeleton={skeleton} lines={1}>
                      {Translate({
                        context: "general",
                        label: "lecturerStatement",
                      })}
                    </Text>
                  </Col>

                  <Col xs={12} className={styles.url}>
                    <Icon
                      src="chevron.svg"
                      size={{ w: 2, h: "auto" }}
                      skeleton={skeleton}
                      alt=""
                    />
                    <Link
                      href={data.url}
                      target="_blank"
                      onFocus={onFocus}
                      disabled={!data.url}
                      border={{ top: false, bottom: { keepVisible: true } }}
                    >
                      <Text type="text2" skeleton={skeleton}>
                        {Translate({
                          ...context,
                          label: "materialReviewLinkText",
                        })}
                      </Text>
                    </Link>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={4} className={styles.author}>
                <span>
                  <Text type="text3" skeleton={skeleton} lines={1}>
                    {Translate({ context: "general", label: "by" })}
                  </Text>
                  <Link
                    target="_blank"
                    disabled={true}
                    border={
                      !skeleton
                        ? { top: false, bottom: { keepVisible: true } }
                        : false
                    }
                  >
                    <Text type="text3" skeleton={skeleton} lines={1}>
                      {data.author}
                    </Text>
                  </Link>
                </span>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </Col>
  );
}

/**
 * Handle a Lector review. A review is one or more paragraphs (chapters). This
 * one handles paragraphs one by one - a paragraph may contain a link to a related
 * work.
 *
 * @param data
 * @param skeleton
 * @return {JSX.Element}
 * @constructor
 */
function LectorReview({ data, skeleton }) {
  const breakpoint = useBreakpoint();
  const isMobile =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md" || false;

  return (
    <Title
      type="title3"
      lines={isMobile ? 5 : 3}
      skeleton={skeleton}
      clamp={true}
    >
      {data.all &&
        data.all
          .map((paragraph) => paragraph)
          .filter(
            (paragraph) =>
              !paragraph.text.startsWith("Materialevurdering") &&
              !paragraph.text.startsWith("Indscannet version")
          )
          .map((paragraph, i) => {
            return (
              <span key={`paragraph-${i}`} className={styles.reviewTxt}>
                <Title type="title3" skeleton={skeleton} lines={1}>
                  {paragraph.text}
                </Title>
                <LectorLink paragraph={paragraph} skeleton={skeleton} />
              </span>
            );
          })}
    </Title>
  );
}

/**
 * Check if a paragraph holds a link to another work - if so parse as link
 * if not return a period (.)
 * @param paragraph
 * @param skeleton
 * @return {JSX.Element|string}
 * @constructor
 */
function LectorLink({ paragraph, skeleton }) {
  if (!paragraph.work) {
    return ". ";
  }

  // @TODO there may be more than one creator - for now simply grab the first
  // @TODO if more should be handled it should be done here: src/lib/utils::encodeTitleCreator
  const creator = paragraph.work.creators[0]?.name
    ? paragraph.work.creators[0].name
    : "";
  const title = paragraph.work.title ? paragraph.work.title : "";
  const title_crator = encodeTitleCreator(title, creator);

  const path = `/materiale/${title_crator}/${paragraph.work.id}`;
  return <Link href={path}>{paragraph.work.title}</Link>;
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param
    {obj}
    props
 *  See propTypes for specific props and types
 *
 * @returns
    {component}
 */
export function MaterialReviewSkeleton(props) {
  const data = {
    author: "Svend Svendsen",
    media: "Jyllandsposten",
    rating: "4/5",
    reviewType: "MATERIALREVIEW",
    date: "2013-06-25",
    url: "http://",
  };

  return (
    <MaterialReview
      {...props}
      data={data}
      className={`${props.className || ""} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param
    {obj}
    props
 * See propTypes for specific props and types
 *
 * @returns
    {component}
 */
export default function Wrap(props) {
  const { data, error, isSkeleton } = props;

  if (isSkeleton) {
    return <MaterialReviewSkeleton />;
  }

  if (error) {
    return null;
  }

  return <MaterialReview {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};

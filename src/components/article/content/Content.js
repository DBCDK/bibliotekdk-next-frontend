import PropTypes from "prop-types";
import { get } from "lodash";
import { Container, Row, Col } from "react-bootstrap";
import { useData } from "@/lib/api/api";

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Image from "@/components/base/image";
import Translate from "@/components/base/translate";

import * as articleFragments from "@/lib/api/article.fragments";

import styles from "./Content.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.width
 * @param {obj} props.height
 *
 * @returns {component}
 */
function getOrientation({ width, height }) {
  if (height > width) {
    return "portrait";
  } else {
    return "landscape";
  }
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Content({ className = "", data = {}, skeleton = false }) {
  if (!data.article) {
    return null;
  }

  const article = data.article;

  const hasUrl = article.fieldImage && article.fieldImage.url;

  const orientation =
    (hasUrl && getOrientation(article.fieldImage)) || "landscape";

  console.log("article", article);

  // Translate Context
  const context = { context: "article" };

  return (
    <Container as="article" fluid>
      <Row className={`${styles.content} ${className}`}>
        <Col
          className={styles.top}
          xs={12}
          lg={{ span: 10, offset: 1 }}
          xl={{ span: 8, offset: 2 }}
        >
          <Row>
            {hasUrl && (
              <Col
                className={`${styles.img} ${styles[orientation]}`}
                xs={12}
                md={6}
              >
                <Image
                  //   width={article.fieldImage.width}
                  //   height={article.fieldImage.height}
                  src={article.fieldImage.url}
                  alt={article.fieldImage.alt || ""}
                  layout="fill"
                  objectFit="cover"
                />
              </Col>
            )}
            <Col className={styles.title} xs={12} md={6}>
              <Title type="title3" skeleton={skeleton}>
                {article.title}
              </Title>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col className={styles.abstract} xs={12}>
          <Text type="text1" skeleton={skeleton} lines={5}>
            {article.fieldRubrik && (
              <div dangerouslySetInnerHTML={{ __html: article.fieldRubrik }} />
            )}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col className={styles.body} xs={12}>
          <Text type="text2" skeleton={skeleton}>
            {article.body && (
              <div dangerouslySetInnerHTML={{ __html: article.body.value }} />
            )}
          </Text>
        </Col>
      </Row>
    </Container>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export function ContentSkeleton(props) {
  const mock = { article: {} };

  return (
    <Content
      {...props}
      data={mock}
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
 * @returns {component}
 */
export default function Wrap(props) {
  const { articleId } = props;

  const { data, isLoading, error } = useData(
    articleFragments.article({ articleId })
  );

  //   const data = {
  //     title: "Digitale bibliotekstilbud",
  //     fieldRubrik:
  //       "Læs mere om forfattere, musik og temaer. Se film, læs artikler, e- og lydbøger, og meget mere.",
  //     fieldImage: {
  //       alt: "some image alt",
  //       title: "some image title",
  //       url: "/img/bibdk-hero-scaled.jpeg",
  //     },
  //     body: {
  //       value: "<p>Denne streng <b>vil</b> indeholde html-formatering</p>",
  //     },
  //   };

  if (error) {
    return null;
  }
  if (isLoading || !get(data, "article.body.value")) {
    return <ContentSkeleton {...props} />;
  }

  return <Content {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  articleId: PropTypes.string,
  skeleton: PropTypes.bool,
};

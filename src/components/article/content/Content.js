import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import { useData } from "@/lib/api/api";

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Image from "@/components/base/image";
import Skeleton from "@/components/base/skeleton";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import * as articleFragments from "@/lib/api/article.fragments";

import { timestampToShortDate } from "@/utils/datetimeConverter";

import styles from "./Content.module.css";
import BodyParser from "@/components/base/bodyparser/BodyParser";
import { getLangcode } from "@/components/base/translate/Translate";

function ArticleHeader({ article }) {
  const context = { context: "articles" };

  let creatorName =
    article && article.entityOwner && article.entityOwner.name
      ? article.entityOwner.name
      : "Af redaktøren";

  if (creatorName === "admin") {
    creatorName = "Af bibliotek.dk redaktionen";
  }

  let category =
    article && article.fieldTags
      ? article.fieldTags
          .slice(0, 1)
          .map((fieldTag, index) => fieldTag.entity.entityLabel)
          .join(", ")
      : "Nyhed";

  return (
    <Row>
      <Col
        className={styles.info}
        xs={12}
        md={{ span: 10, offset: 1 }}
        lg={{ span: 6, offset: 3 }}
      >
        <Row className={styles.test}>
          <Col xs={6} md={"auto"}>
            <Text type="text3" dataCy="article-header-date">
              {timestampToShortDate(article.entityCreated)}
            </Text>
          </Col>
          <Col xs={6} md={"auto"}>
            <Text type="text3">{category}</Text>
          </Col>
          <Col xs={6} md={"auto"}>
            <Text type="text3">{creatorName}</Text>
          </Col>
          <Col xs={6} md={"auto"}>
            <Link
              dataCy="article-print"
              tag="span"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== "undefined") {
                  window.print();
                }
              }}
            >
              <Text type="text3">
                {Translate({ ...context, label: "printButton" })}
              </Text>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

/**
 * Orientation function
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
  console.log(data, "DATA");

  if (!data.article) {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const context = { context: "articles" };

  const article = data.article;

  // check if article has image url
  const hasUrl = article.fieldImage && article.fieldImage.url;

  const noImageClass = hasUrl ? "" : styles.noImage;

  // check article image orientation -> adds orientation class [portrait/landscape(default)]
  const orientation =
    (hasUrl && getOrientation(article.fieldImage)) || "landscape";

  return (
    <Container as="article" fluid>
      <Row className={`${styles.content} ${className}`}>
        <Col
          className={`${styles.top} ${noImageClass}`}
          xs={12}
          lg={{ span: 8, offset: 2 }}
        >
          <Row>
            {hasUrl && (
              <Col
                className={`${styles.left} ${styles[orientation]}`}
                xs={12}
                md={6}
              >
                <Image
                  //   width={article.fieldImage.width}
                  //   height={article.fieldImage.height}
                  src={article.fieldImage.url}
                  alt={article.fieldImage.alt || ""}
                  title={article.fieldImage.title || ""}
                  layout="fill"
                  objectFit="cover"
                />
                {skeleton && <Skeleton />}
              </Col>
            )}
            <Col
              className={styles.right}
              xs={12}
              md={{ span: hasUrl ? 6 : 10, offset: hasUrl ? 0 : 1 }}
            >
              <Title type="title3" skeleton={skeleton}>
                {article.title}
              </Title>
            </Col>
          </Row>
        </Col>
      </Row>
      <ArticleHeader article={article} />
      <Row>
        <Col
          className={styles.rubrik}
          xs={12}
          md={{ span: 10, offset: 1 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Title type="title4" skeleton={skeleton} lines={3}>
            {article.fieldRubrik && (
              <span dangerouslySetInnerHTML={{ __html: article.fieldRubrik }} />
            )}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col
          data-cy="article-body"
          xs={12}
          md={{ span: 10, offset: 1 }}
          lg={{ span: 6, offset: 3 }}
        >
          <BodyParser
            body={article?.body?.value}
            className={styles.body}
            skeleton={skeleton}
            lines={10}
          />
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
  const mock = {
    article: {
      fieldImage: {
        url: "/img/article-dummy.jpeg",
      },
    },
  };

  return (
    <Content
      {...props}
      data={props.data || mock}
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
  const langcode = { language: getLangcode() };

  let articleArgs = { ...props, ...langcode };
  const { data, isLoading, error } = useData(
    articleFragments.article(articleArgs)
  );

  if (error) {
    return null;
  }

  if (isLoading) {
    return <ContentSkeleton {...props} data={null} />;
  }

  return <Content {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  articleId: PropTypes.string,
  skeleton: PropTypes.bool,
};

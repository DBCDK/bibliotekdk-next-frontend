import { useMemo } from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
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
import { getLanguage } from "@/components/base/translate/Translate";
import { Rating } from "@/components/base/rating/Rating";
import { ReviewHeadingLink } from "@/components/article/lectorreview/reviewheading/ReviewHeading";

function ArticleHeader({ article, skeleton }) {
  const context = { context: "articles" };

  let category = (
    article?.category?.slice(0, 2) ||
    (article?.fieldTags?.length > 0 &&
      article?.fieldTags
        ?.slice(0, 2)
        .map((fieldTag) => fieldTag.entity.entityLabel)) || ["Nyhed"]
  ).join(", ");

  const readTime = useMemo(() => {
    if (article?.body?.value) {
      return calcReadTime(article?.body?.value);
    }
  }, [article?.body?.value]);

  return (
    <Row>
      <Col
        className={styles.info}
        xs={12}
        md={{ span: 10, offset: 1 }}
        lg={{ span: 6, offset: 3 }}
      >
        <Row className={styles.test}>
          {(skeleton || readTime) && (
            <Col xs={6} md={"auto"}>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {Translate({
                  ...context,
                  label: "readTime",
                  vars: [readTime],
                })}
              </Text>
            </Col>
          )}
          <Col xs={6} md={"auto"}>
            <Text
              type="text3"
              dataCy="article-header-date"
              skeleton={skeleton}
              lines={1}
            >
              {article?.entityCreated}
            </Text>
          </Col>
          <Col xs={6} md={"auto"}>
            <Text type="text3" skeleton={skeleton} lines={1}>
              {category}
            </Text>
          </Col>
          <Col xs={6} md={"auto"}>
            {!skeleton && (
              <Link
                dataCy="article-print"
                tag="span"
                border={{ bottom: { keepVisible: true } }}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
              >
                <Text type="text3" tag="span">
                  {Translate({ ...context, label: "printButton" })}
                </Text>
              </Link>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

/**
 * Orientation function
 *
 * @param {Object} props
 * @param {Object} props.width
 * @param {Object} props.height
 *
 * @returns {React.ReactElement | null}
 */
function getOrientation({ width, height }) {
  if (height > width) {
    return "portrait";
  } else {
    return "landscape";
  }
}

/**
 *
 * @param {*} htmlString
 * @returns {number} time in minutes
 */
function calcReadTime(htmlString) {
  // Strip HTML tags
  const stripped = htmlString.replace(/<\/?[^>]+(>|$)/g, "");
  const wordCount = stripped.split(/\s+/).length;

  // Average reading speed is supposedly 238 words per minute
  // But we adjust it as needed
  const wordsPerMinute = 225;

  // We round up to nearest minute
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
 */
export function Content({
  className = "",
  data = {},
  backToMaterial = null,
  skeleton = false,
}) {
  if (!data?.article) {
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
        {backToMaterial && (
          <Col xs={{ span: 1, offset: 0 }} md={{ span: 1, offset: 0 }}>
            <ReviewHeadingLink
              propAndChildrenInput={backToMaterial}
              className={styles.backImageleft}
            />
          </Col>
        )}
        <Col
          className={`${styles.top} ${noImageClass}`}
          xs={12}
          lg={{ span: 8, offset: backToMaterial ? 1 : 2 }}
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
              <div>
                <Title type="title3" skeleton={skeleton}>
                  {article.title}
                </Title>
                {article.paper && (
                  <Text type="text3" skeleton={skeleton}>
                    {article.paper}
                    {article.pages && <span> ({article.pages})</span>}
                  </Text>
                )}
                {article.deliveredBy && (
                  <Text type="text3" skeleton={skeleton}>
                    {Translate({
                      ...context,
                      label: "deliveredBy",
                      vars: [article.deliveredBy],
                    })}
                  </Text>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <ArticleHeader article={article} skeleton={skeleton} />
      {article.creators && (
        <Row>
          <Col xs={12} md={{ span: 10, offset: 1 }} lg={{ span: 6, offset: 3 }}>
            <Text type="text3">
              {Translate({
                context: "bibliographic-data",
                label: "creators",
              })}
            </Text>
            {data.reviewAuthor ? (
              <Text type="text4" key={data.reviewAuthor}>
                {data.reviewAuthor}
              </Text>
            ) : (
              article.creators.map((creator) => (
                <Text type="text4" key={creator.name}>
                  {creator.name}
                </Text>
              ))
            )}
            {article.rating && (
              <div className={styles.rating}>
                <Rating rating={article.rating} skeleton={false} />
              </div>
            )}
          </Col>
        </Row>
      )}
      {(article?.fieldRubrik || article?.subHeadLine) && (
        <Row>
          <Col
            className={styles.rubrik}
            xs={12}
            md={{ span: 10, offset: 1 }}
            lg={{ span: 6, offset: 3 }}
          >
            {article?.subHeadLine && (
              <Title type="title4">{article?.subHeadLine}</Title>
            )}
            <Title type="title4" skeleton={skeleton} lines={3}>
              {article.fieldRubrik && (
                <span
                  dangerouslySetInnerHTML={{ __html: article.fieldRubrik }}
                />
              )}
            </Title>
          </Col>
        </Row>
      )}

      {(skeleton || article?.body?.value) && (
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
            {article?.disclaimer && (
              <div className={styles.disclaimer}>
                <img src={article?.disclaimer?.logo} alt="logo" />
                <Text type="text3">{article?.disclaimer?.text}</Text>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
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
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
 */
export default function Wrap(props) {
  const langcode = { language: getLanguage() };

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

  const parsed = {
    article: {
      ...data?.article,
      entityCreated: timestampToShortDate(data?.article?.entityCreated),
    },
  };

  return <Content {...props} data={parsed} />;
}

// PropTypes for component
Wrap.propTypes = {
  articleId: PropTypes.string,
  skeleton: PropTypes.bool,
};

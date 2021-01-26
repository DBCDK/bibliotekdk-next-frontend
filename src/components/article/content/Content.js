import { useMemo } from "react";
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

/**
 * Body parse search-and-replace funtion
 *
 * @param {string} str
 *
 * @returns {string}
 */
function parseBody(str) {
  const img_regex = /<\s*img[^>]*\/>/g;
  const cap_regex = /data-caption=\"(.*?)\"/;

  const img = str.match(img_regex);

  img &&
    img.map((img) => {
      if (img) {
        const caption = img.match(cap_regex);

        let captionEl = "";
        if (caption && caption[1]) {
          captionEl = `<figcaption>${caption[1]}</figcaption>`;
        }

        const newEl = `<figure> ${img} ${captionEl && captionEl}</figure>`;
        str = str.replace(img, newEl);
      }
    });

  return str;
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
  if (!data.article) {
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

  const parsedBody = useMemo(() => {
    if (article.body && article.body.value) {
      return parseBody(article.body.value);
    }
    return "";
  }, [article.body && article.body.value]);

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

      <Row>
        <Col
          className={styles.info}
          xs={12}
          md={{ span: 10, offset: 1 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Row className={styles.test}>
            <Col xs={6} md={"auto"}>
              <Text type="text4">
                {timestampToShortDate(article.entityCreated)}
              </Text>
            </Col>
            <Col xs={6} md={"auto"}>
              <Text type="text4">Nyhed</Text>
            </Col>
            <Col xs={6} md={"auto"}>
              <Text type="text4">Af bibliotek.dk redaktionen</Text>
            </Col>
            <Col xs={6} md={"auto"}>
              <Link
                tag="span"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
              >
                <Text type="text4">
                  {Translate({ ...context, label: "printButton" })}
                </Text>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col
          className={styles.rubrik}
          xs={12}
          md={{ span: 10, offset: 1 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Title type="title4" skeleton={skeleton} lines={3}>
            {article.fieldRubrik && (
              <div dangerouslySetInnerHTML={{ __html: article.fieldRubrik }} />
            )}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col
          className={styles.body}
          xs={12}
          md={{ span: 10, offset: 1 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Text type="text2" skeleton={skeleton} lines={30}>
            {article.body && (
              <div
                dangerouslySetInnerHTML={{
                  __html: parsedBody,
                }}
              />
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
  const { articleId } = props;

  const { data, isLoading, error } = useData(
    articleFragments.article({ articleId })
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

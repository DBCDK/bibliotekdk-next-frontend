import PropTypes from "prop-types";
import styles from "./Preview.module.css";
import Image from "@/components/base/image";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Skeleton from "@/components/base/skeleton";
import Link from "@/components/base/link";
import { articlePathAndTarget } from "@/components/articles/utils";

/**
 * Animated arrow that turns into a line when hovered/focused
 */
export function Arrow({ className = "" }) {
  return (
    <div className={`${styles.arrow} ${className}`}>
      <div className={styles.trapezoid} />
      <div className={styles.trapezoid} />
      <div className={styles.trapezoid} />
      <div className={styles.trapezoid} />
      {/* <div className={styles.flatnose} /> */}
    </div>
  );
}

/**
 * Preview of article
 *
 * @param {object} props
 * @param {object} props.article
 * @param {boolean} props.skeleton
 */
export default function ArticlePreview({ article, skeleton, rubrik = true }) {
  const image = article && article.fieldImage;
  const { target, query, pathname } = articlePathAndTarget(article);

  return (
    <Link
      a={false}
      href={{
        pathname: pathname,
        query: query,
      }}
    >
      <a
        className={styles.preview}
        data-cy="article-preview"
        target={`${target}`}
      >
        <div className={styles.imagewrapper}>
          {image && (
            <Image
              src={image.url}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
            />
          )}
          {skeleton && <Skeleton className={styles.imageskeleton} />}
        </div>

        <Title
          className={styles.title}
          tag="h3"
          type="title3"
          lines={1}
          skeleton={skeleton}
        >
          {article.title}
        </Title>
        {rubrik && (
          <Text type="text2" lines={3} clamp={true} skeleton={skeleton}>
            {article.fieldRubrik}
          </Text>
        )}
        <Arrow />
      </a>
    </Link>
  );
}
ArticlePreview.propTypes = {
  article: PropTypes.object,
  skeleton: PropTypes.bool,
  rubrik: PropTypes.bool,
};

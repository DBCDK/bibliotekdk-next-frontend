import PropTypes from "prop-types";
import styles from "./Preview.module.css";
import Image from "@/components/base/image";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Skeleton from "@/components/base/skeleton";
import Link from "@/components/base/link";

/**
 * Animated arrow that turns into a line when hovered/focused
 */
function Arrow() {
  return (
    <div className={styles.arrow}>
      <div />
      <div />
      <div />
      <div />
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
export default function ArticlePreview({ article, skeleton }) {
  const image = article && article.fieldImage;
  return (
    <Link
      a={false}
      // TODO fix href object when article page exists
      href={{
        pathname: "/article",
        query: {
          articleId: article.nid,
        },
      }}
    >
      <a className={styles.preview} data-cy="article-preview">
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

        <Title tag="h3" type="title3" lines={1} skeleton={skeleton}>
          {article.title}
        </Title>
        <Text type="text2" lines={3} clamp={true} skeleton={skeleton}>
          {article.fieldRubrik}
        </Text>
        <Arrow />
      </a>
    </Link>
  );
}
ArticlePreview.propTypes = {
  article: PropTypes.object,
  skeleton: PropTypes.bool,
};

import { getCoverImage } from "@/components/utils/getCoverImage";
import styles from "./ThumbnailParade.module.css";
import cx from "classnames";
import Skeleton from "@/components/base/skeleton";

export default function ThumbnailParade({ series, seriesIsLoading }) {
  const thumbnails = series?.[0]?.members
    ?.map((member) => getCoverImage(member?.work?.manifestations?.mostRelevant))
    ?.filter((cover) => cover?.origin === "moreinfo")
    ?.map((cover) => cover?.thumbnail)
    .slice(0, 5);

  const length = thumbnails?.length;
  const width = 75;
  const offset = 16;

  if (seriesIsLoading) {
    return <Skeleton />;
  }

  if (length === 0) {
    return null;
  }

  return (
    <div
      className={styles.thumbnail_group}
      style={{
        width: `${width + offset * length}px`,
      }}
    >
      {thumbnails?.map((thumbnail, index) => (
        <div
          key={thumbnail}
          style={{
            marginRight: `-${width - offset}px`,
            bottom: "100%",
            zIndex: `-${index}`,
          }}
          className={styles.thumbnail_container}
        >
          <img
            className={cx(styles.thumbnail)}
            src={thumbnail}
            alt=""
            width={`${width}px`}
          />
        </div>
      ))}
    </div>
  );
}

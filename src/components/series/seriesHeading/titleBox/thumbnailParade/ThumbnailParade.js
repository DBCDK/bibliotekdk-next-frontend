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

  return (
    <div
      className={styles.thumbnail_group}
      style={{
        marginRight: `-${(length - 1) * (width - offset) + 1}px`,
      }}
    >
      {thumbnails?.map((thumbnail, index) => (
        <img
          key={thumbnail}
          style={{
            transform: `translate(-${index * (width - offset)}px)`,
            zIndex: `${length - index}`,
          }}
          className={cx(styles.thumbnail)}
          src={thumbnail}
          alt=""
          width={`${width}px`}
        />
      ))}
    </div>
  );
}

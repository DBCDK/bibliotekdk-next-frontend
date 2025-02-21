import { getCoverImage } from "@/components/utils/getCoverImage";
import styles from "./ThumbnailParade.module.css";
import cx from "classnames";
import Skeleton from "@/components/base/skeleton";

export default function ThumbnailParade({ series, isLoading }) {
  // for skeleton view
  const dummy = [...new Array(5).fill("/")];

  const thumbnails = series?.members
    ?.map((member) => getCoverImage(member?.work?.manifestations?.mostRelevant))
    ?.filter((cover) => cover?.origin === "fbiinfo")
    ?.map((cover) => cover?.thumbnail)
    .slice(0, 5);

  const data = isLoading ? dummy : thumbnails;

  const length = data?.length;
  const width = 75;
  const offset = 16;

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
      {data?.map((thumbnail, index) => (
        <div
          key={thumbnail + index}
          style={{
            marginRight: `-${width - offset}px`,
            bottom: "100%",
            zIndex: `-${index}`,
          }}
          className={styles.thumbnail_container}
        >
          {isLoading && <Skeleton />}
          <img
            className={cx(styles.thumbnail)}
            src={thumbnail}
            alt=""
            width={`${width}px`}
            height={isLoading && "120px"}
          />
        </div>
      ))}
    </div>
  );
}

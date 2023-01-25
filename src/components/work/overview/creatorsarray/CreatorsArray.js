import Link from "@/components/base/link";
import Text from "@/components/base/text";
import styles from "@/components/work/overview/Overview.module.css";

export function CreatorsArray({ creators, skeleton }) {
  const searchOnUrl = "/find?q.creator=";
  return (
    creators?.map((creator, index) => {
      return (
        <span key={`${creator.display}-${index}`}>
          <Link
            disabled={skeleton}
            href={`${searchOnUrl}${creator.display}`}
            border={{ top: false, bottom: { keepVisible: true } }}
          >
            <Text
              type="text3"
              className={styles.creators}
              skeleton={skeleton}
              lines={1}
            >
              {creator.display}
            </Text>
          </Link>
          {creators?.length > index + 1 ? ", " : ""}
        </span>
      );
    }) || null
  );
}

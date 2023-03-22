import { useData } from "@/lib/api/api";
import { manifestationParts } from "@/lib/api/manifestation.fragments";
import styles from "./ManifestationParts.module.css";
import Text from "@/components/base/text/Text";

export function ManifestationParts({ parts }) {
  return (
    <ul className={styles.manifestionlist}>
      {parts?.map(
        (part) =>
          part && (
            <li>
              <Text type="text3" lines={1}>
                {part.title}
              </Text>
              {part.playingTime && (
                <Text type="text3" lines={1}>
                  {part.playingTime}
                </Text>
              )}
            </li>
          )
      )}
    </ul>
  );
}

export default function Wrap({ pid }) {
  const { data, isLoading, error } = useData(
    pid && manifestationParts({ pid: pid })
  );

  if (error || !data) {
    return null;
  }
  if (isLoading) {
    return null;
  }

  const parts = data?.manifestation?.manifestationParts?.parts;
  return <ManifestationParts parts={parts} />;
}

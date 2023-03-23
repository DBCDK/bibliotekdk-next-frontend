import { useData } from "@/lib/api/api";
import { manifestationParts } from "@/lib/api/manifestation.fragments";
import styles from "./ManifestationParts.module.css";
import Text from "@/components/base/text/Text";
import animations from "@/components/base/animation/animations.module.css";

export function ManifestationParts({ parts, titlesOnly = true, className }) {
  return (
    <ul className={(className && className) || styles.manifestionlist}>
      {parts?.map(
        (part) =>
          part && (
            <li>
              <Text type="text3" lines={1}>
                {part.title}
              </Text>
              {part.playingTime && !titlesOnly && (
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

export default function Wrap({
  pid,
  numberToShow,
  titlesOnly = false,
  className,
}) {
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

  console.log(parts?.length, numberToShow, "VARTS");

  const partsToShow = (numberToShow && parts?.splice(0, numberToShow)) || parts;

  /*const partsToShow =
    parts && numberToShow
      ? parts.splice(0, numberToShow)
      : parts
      ? parts
      : null;

  console.log(partsToShow, "PARTS");*/
  return (
    <ManifestationParts
      parts={parts}
      titlesOnly={titlesOnly}
      className={className}
      // @TODO - we need a title also
    />
  );
}

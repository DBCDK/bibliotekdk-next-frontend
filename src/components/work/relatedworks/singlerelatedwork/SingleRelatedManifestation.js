import styles from "./SingleRelatedManifestation.module.css";
import Text from "@/components/base/text";
import { formatMaterialTypesToPresentation } from "@/lib/manifestationFactoryUtils";
import Translate from "@/components/base/translate";
import animations from "@/components/base/animation/animations.module.css";
import Link from "@/components/base/link";
import { encodeTitleCreator } from "@/lib/utils";

export default function SingleRelatedManifestation({ manifestation }) {
  const fullTitle = manifestation?.titles?.full?.join(": ");
  const creator = manifestation?.creators?.[0]?.display;
  const workId = manifestation?.workId;
  const formattedMaterialTypes = formatMaterialTypesToPresentation(
    manifestation?.materialTypesArray
  );
  const src = manifestation?.cover?.detail;

  const animationStyle = [
    animations.underlineContainer,
    animations.top_line_false,
    animations.top_line_keep_false,
    animations.bottom_line_keep_false,
  ].join(" ");

  return (
    <Link
      href={{
        pathname: "/materiale/[title_author]/[workId]",
        query: {
          title_author: encodeTitleCreator(fullTitle, creator),
          workId,
        },
      }}
      className={`${styles.link_style}`}
      border={{ top: false, bottom: false }}
      data_display={"inline"}
      a={true}
      tag={"a"}
    >
      <div className={`${styles.related_element} ${animationStyle}`}>
        <img
          src={src}
          className={`${styles.cover}`}
          style={{
            "--background_image": `url(${src})`,
          }}
          title={fullTitle}
          alt={Translate({ context: "general", label: "frontpage" })}
        />
        <div className={styles.text}>
          {manifestation.partInSeries && (
            <Text
              type={"text1"}
              data_disply={"inline"}
              className={`${styles.wrap_one_line}`}
            >
              {manifestation.partInSeries}
            </Text>
          )}
          <Text
            type={"text1"}
            data_disply={"inline"}
            className={`${styles.wrap_two_lines}`}
            title={fullTitle}
          >
            {fullTitle}
          </Text>
          <div className={styles.margin_auto} />
          <Text
            type={"text2"}
            data_disply={"inline"}
            className={`${styles.wrap_one_line}`}
            title={creator}
          >
            {creator}
          </Text>
          <Text
            type={"text2"}
            data_disply={"inline"}
            className={`${styles.wrap_one_line}`}
            title={formattedMaterialTypes}
          >
            {formattedMaterialTypes}
          </Text>
        </div>
      </div>
    </Link>
  );
}

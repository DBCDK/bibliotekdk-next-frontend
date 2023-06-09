import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Top from "../base/top";
import Cover from "@/components/base/cover";
import Icon from "@/components/base/icon";
import styles from "./Material.module.css";
import Translate from "@/components/base/translate";
import { MaterialRowButton } from "@/components/profile/materialRow/MaterialRow";
import { getWorkUrl } from "@/lib/utils";
import Link from "@/components/base/link";
import Recommendations from "@/components/work/recommendations";

const Material = ({ context }) => {
  const { label, title, creator, materialType, creationYear, image, workId } =
    context;

  return (
    <article className={styles.Material}>
      <Top title={label} titleTag="h4" />
      <hr />
      <div className={styles.splitContainer}>
        <div>
          {/**
           * This is the main titel of the article
           * h3 used as it's correct for the context
           * https://stackoverflow.com/questions/38448811/is-it-semantically-correct-to-use-h1-in-a-dialog
           * */}
          <Title type="title5" tag="h3">
            {title}
          </Title>
          {creator && (
            <Text type="text2" className={styles.spacer}>
              {creator}
            </Text>
          )}
          {materialType && creationYear && (
            <Text type="text2" className={styles.spacer}>
              {materialType}, {creationYear}
            </Text>
          )}

          <Text type="text2" className={styles.spacer}>
            Afleveres d. 30 maj 2023
          </Text>
          <div className={styles.status}>
            <Icon
              className={styles.ornament}
              size={{ w: 5, h: "auto" }}
              src={"ornament1.svg"}
              alt=""
            />
            <Text type="text2">Frist overskredet</Text>
          </div>

          <MaterialRowButton wrapperClassname={styles.button}>
            {Translate({ context: "profile", label: "renew" })}
          </MaterialRowButton>
        </div>
        <div>
          <Cover src={image} size="fill-width" />
        </div>
      </div>

      <Link
        border={{
          top: false,
          bottom: {
            keepVisible: true,
          },
        }}
        className={styles.link}
        href={getWorkUrl(title, creator, workId)}
      >
        <Text type="text2">Gå til bogen</Text>
      </Link>

      <Text type="text2">Udlånt af</Text>
      <Text type="text1">Sorø bibliotek</Text>
      <div className={styles.recommendationsContainer}>
        <Recommendations
          workId={workId}
          anchor-label={Translate({
            context: "recommendations",
            label: "remindsOf",
          })}
          headerTag="h3"
          titleDivider={false}
        />
      </div>
    </article>
  );
};

export default Material;

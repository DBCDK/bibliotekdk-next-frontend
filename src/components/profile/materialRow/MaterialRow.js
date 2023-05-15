import Cover from "@/components/base/cover/Cover";
import Button from "@/components/base/button/Button";
import Text from "@/components/base/text";
import styles from "./MaterialRow.module.css";
import Title from "@/components/base/title";

export default ({
  image,
  title,
  creator,
  materialType,
  creationYear,
  library,
  buttonText = null,
  buttonAction,
}) => {
  return (
    <article className={styles.materialRow}>
      <div>
        <Cover src={image} className={styles.cover} size="fill-width" />
      </div>

      <div className={styles.info}>
        {/* Make correct header */}
        <Title type="title8" as="h4">
          {title}
        </Title>
        <Text type="text2">{creator}</Text>
        <Text type="text2">
          {materialType}, {creationYear}
        </Text>
      </div>

      <div>
        <Text type="text2">{library}</Text>
      </div>

      <div>
        <Text type="text2">6. okt 2022</Text>
      </div>

      <div>
        {
          buttonText && (
            <div className={styles.buttonContainer}>
            <Button type="secondary" size="small" onClick={buttonAction}>
              {buttonText}
            </Button>
          </div>
          )
        }
      </div>
    </article>
  );
};

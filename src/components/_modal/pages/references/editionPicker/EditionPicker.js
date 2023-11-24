import Title from "@/components/base/title";
import Top from "../../base/top/Top";
import Cover from "@/components/base/cover";
import styles from "./EditionPicker.module.css";
import Text from "@/components/base/text";

const EditionOption = ({ manifestation, onClick }) => {
  const { cover, edition, titles, ownerWork, pid } = manifestation;
  const onOptionClick = () => {
    if (!onClick) return;
    onClick(pid);
  };

  return (
    <article
      className={styles.EditionOption}
      role="button"
      onClick={onOptionClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onOptionClick();
        }
      }}
    >
      <div className={styles.Dot} />
      <div className={styles.ImageContainer}>
        <Cover src={cover?.thumbnail} size="fill-width" />
      </div>
      <div className={styles.Info}>
        <Text type="text1">{edition?.publicationYear?.display}</Text>
        <Title tag="h5" type="text1">
          {titles?.full}
          {edition?.edition && `, ${edition.edition}`}
        </Title>
        <Text type="text2">
          {ownerWork?.creators?.[0]?.display}
          {ownerWork?.workYear?.display && `, ${ownerWork?.workYear?.display}`}
        </Text>
      </div>
    </article>
  );
};

const EditionPicker = ({ context }) => {
  const { material, materialType, onEditionPick } = context;
  const manifestations = material?.manifestations?.mostRelevant;

  return (
    <div className={styles.EditionPicker}>
      <Top skeleton={false} title={"Vælg udgave"} />

      <Title tag="h3" type="text1" className={styles.EditionPickerTitle}>
        {material?.titles?.full?.[0]}
      </Title>
      <Text type="text2" className={styles.EditionPickerSubTitle}>
        {material?.creators?.[0]?.display}
      </Text>
      <Title tag="h4" type="text2" className={styles.MaterialType}>
        {materialType}
      </Title>

      {manifestations.map((mani) => (
        <EditionOption manifestation={mani} onClick={onEditionPick} />
      ))}
    </div>
  );
};

export default EditionPicker;

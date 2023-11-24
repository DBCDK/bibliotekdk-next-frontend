import Title from "@/components/base/title";
import Top from "../../base/top/Top";
import Cover from "@/components/base/cover";
import styles from "./EditionPicker.module.css";
import { RadioButtonItem } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";

const EditionOption = ({manifestation, onClick}) => {
  const { cover, edition, titles, ownerWork, pid } = manifestation; 
  const onOptionClick = () => {
    if (!onClick) return;
    onClick(pid);
    console.log(manifestation)

  }

  return (
    <article className={styles.EditionOption} role="button" onClick={onOptionClick} tabIndex={0} onKeyDown={(e) => {
      if (e.key === "Enter") {
        onOptionClick();
      }
    }}>
      <div className={styles.Dot} />
      <div className={styles.ImageContainer}><Cover src={cover?.thumbnail} size="fill-width" /></div>
      <div className={styles.Info}>
        <Text>{edition?.publicationYear?.display}</Text>
        <Title tag="h5" type="text2">{titles?.full}{edition?.edition && `, ${edition.edition}`}</Title>
        <Text>{ownerWork?.creators?.[0]?.display}{ownerWork?.workYear?.display && `, ${ownerWork?.workYear?.display}`}</Text>
      </div>
    </article>
  )
}

const EditionPicker = ({ context }) => {
  const { material, onClick } = context;
  const manifestations = material?.manifestations?.mostRelevant;
  console.log(material);

  return (
    <div className={styles.EditionPicker}>
      <Top
        skeleton={false}
        title={"Vælg udgave"}
      />

      <Title tag="h3" type="title4">{material?.titles?.full?.[0]}</Title>
      <Title tag="h4" type="text2">{material?.creators?.[0]?.display}</Title>

      {
        manifestations.map(mani => (
          <EditionOption manifestation={mani} onClick={onClick} />
        ))
      }


    </div>
  )
}

export default EditionPicker;
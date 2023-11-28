import IconButton from "@/components/base/iconButton/IconButton";
import Icon from "@/components/base/icon/Icon";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ChevronRight from "@/public/icons/chevron_right.svg";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./MultiReferences.module.css";
import Translate from "@/components/base/translate/Translate";
import { CONTEXT } from "./MultiReferences";

const ButtonRow = ({ onClick, onDeleteClick }) => {
  return (
    <div className={styles.buttonRowContainer}>
      <IconButton
        keepUnderline={true}
        className={styles.removeButton}
        onClick={onDeleteClick}
      >
        {Translate({
          context: CONTEXT,
          label: "remove",
        })}
      </IconButton>
      <div className={styles.buttonLink}>
        <Icon
          src="exclamationmark.svg"
          alt="info"
          data-cy="tooltip-icon"
          size="2_5"
          className={styles.exclamationmark}
        />

        <IconLink
          onClick={onClick}
          className={styles.link}
          border={{ bottom: { keepVisible: true }, top: false }}
          tag={"button"}
          iconSrc={ChevronRight}
          iconPlacement={"right"}
        >
          {Translate({
            context: CONTEXT,
            label: "choose-edition-short",
          })}
        </IconLink>
      </div>
    </div>
  );
};

export default ButtonRow;

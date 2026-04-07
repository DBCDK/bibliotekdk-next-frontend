import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./HasBeenOrderedRow.module.css";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";
import CheckmarkBlueSvg from "@/public/icons/checkmark_blue.svg";
import CloseSvg from "@/public/icons/close.svg";

const HasBeenOrderedRow = ({ removeOrder, acceptOrder }) => {
  return (
    <div className={`has-been-ordered ${styles.container}`}>
      <Text type="text4">
        {Translate({
          context: "bookmark",
          label: "alreadyOrderedText",
        })}
      </Text>
      <div className={styles.buttonContainer}>
        <IconButton
          icon={<CloseSvg />}
          onClick={removeOrder}
          keepUnderline={true}
          className={styles.icon}
        >
          {Translate({
            context: "bookmark",
            label: "dont-order",
          })}
        </IconButton>
        <IconButton
          onClick={acceptOrder}
          keepUnderline={true}
          icon={<CheckmarkBlueSvg />}
          className={styles.icon}
        >
          {Translate({
            context: "bookmark",
            label: "orderAnyways",
          })}
        </IconButton>
      </div>
    </div>
  );
};

export default HasBeenOrderedRow;

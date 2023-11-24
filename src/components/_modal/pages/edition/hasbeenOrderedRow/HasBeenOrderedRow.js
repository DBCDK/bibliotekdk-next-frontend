import IconButton from "@/components/base/iconButton/IconButton";
import styles from "./HasBeenOrderedRow.module.css";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text";

const HasBeenOrderedRow = ({ removeOrder, acceptOrder }) => {
  return (
    <div className={styles.container}>
      <Text type="text4">
        {Translate({
          context: "bookmark",
          label: "alreadyOrderedText",
        })}
      </Text>
      <div className={styles.buttonContainer}>
        <IconButton
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
          icon="checkmark_blue"
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

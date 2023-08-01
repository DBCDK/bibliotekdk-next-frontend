/* eslint-disable css-modules/no-unused-class */
import styles from "../MaterialRow.module.css";
import Cover from "@/components/base/cover";
import Button from "@/components/base/button";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import cx from "classnames";

const SkeletonMaterialRow = ({ version = "desktop" }) => {
  if (version === "desktop") {
    return (
      <article className={cx(styles.materialRow, styles.materialRow_wrapper)}>
        <div className={styles.materialInfo}>
          <div className={styles.imageContainer}>
            <Cover skeleton size="fill-width" />
          </div>

          <div className={styles.textContainer}>
            <Title type="text1" tag="h3" skeleton lines={1} />
            <Text type="text2" skeleton lines={1} />
            <Text type="text2" className={styles.uppercase} skeleton />
          </div>
        </div>

        <div>
          <Text type="text2" skeleton lines={2} />
        </div>
        <div>
          <Text type="text2" skeleton lines={1} />
        </div>

        <div>
          <Button type="primary" size="small" skeleton />
        </div>
      </article>
    );
  } else if (version === "mobile") {
    return (
      <article className={styles.materialRow_mobile}>
        <div>
          <Cover skeleton size="fill-width" />
        </div>
        <div className={styles.textContainer}>
          <Title type="text1" tag="h3" skeleton lines={1} />
          <Text type="text2" skeleton lines={1} />
          <Text type="text2" className={styles.uppercase} skeleton lines={1} />

          <div className={styles.dynamicContent}>
            <Text type="text2" skeleton lines={2} />
          </div>
        </div>
        <div className={styles.arrowright_container}>
          <Icon
            alt=""
            size={{ w: "auto", h: 2 }}
            src="arrowrightblue.svg"
            className={styles.arrowright}
          />
        </div>
      </article>
    );
  }
};

export default SkeletonMaterialRow;

/* eslint-disable css-modules/no-unused-class  */
/* Since we pass all styles to children  */

/**
 * @file ManifestationContent.js
 * Show manifesttionParts in modal
 */
import Top from "@/components/_modal/pages/base/top";
import Edition from "@/components/_modal/pages/edition/Edition";
import ManifestationParts from "@/components/manifestationparts/ManifestationParts";
import styles from "./ManifestationContent.module.css";
import Translate from "@/components/base/translate";

export default function ManifestationContent(props) {
  const { pid, showOrderTxt, singleManifestation, parts } = props.context;

  return (
    <div>
      <Top
        className={styles}
        title={Translate({
          context: "manifestation_content",
          label: "contents",
        })}
      />
      <Edition
        showOrderTxt={showOrderTxt}
        singleManifestation={singleManifestation}
        context={{ orderPids: [pid] }}
      />

      <ManifestationParts
        pid={pid}
        showMoreButton={false}
        titlesOnly={false}
        parts={parts}
        className={styles.contentlist}
        breakOnCreator={true}
      />
    </div>
  );
}

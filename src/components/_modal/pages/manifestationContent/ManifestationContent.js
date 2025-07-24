/* eslint-disable css-modules/no-unused-class  */
/* Since we pass all styles to children  */

/**
 * @file ManifestationContent.js
 * Show manifesttionParts in modal
 */
import Top from "@/components/_modal/pages/base/top";
import Edition from "@/components/_modal/pages/edition/Edition";
import styles from "./ManifestationContent.module.css";
import Translate from "@/components/base/translate";
import {
  TableOfContentsEntries,
  useTablesOfContents,
} from "@/components/work/contents/Contents";

export default function ManifestationContent(props) {
  const { workId, type, pid, showOrderTxt } = props.context;
  const { flattened, count } = useTablesOfContents({ workId, type, pid });

  return (
    <div>
      <Top
        className={styles}
        title={Translate({
          context: "manifestation_content",
          label: "contents",
        })}
      />
      <Edition showOrderTxt={showOrderTxt} pids={[pid]} />
      <TableOfContentsEntries
        flattened={flattened}
        className={styles.tableOfContentsEntries}
        count={count}
      />
    </div>
  );
}

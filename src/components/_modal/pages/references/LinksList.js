import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";
import cx from "classnames";

// eslint-disable-next-line css-modules/no-unused-class
import styles from "./References.module.css";
import { getAppUrl } from "@/lib/utils";

/**
 * @param {Array<String>} pids
 * @returns
 */
const onlinelinks = (pids) => {
  const APP_URL = getAppUrl();

  return {
    refworks: `http://www.refworks.com/express/ExpressImport.asp?vendor=bibliotek.dk&filter=RefWorks Tagged Format&encoding=28591&url=${APP_URL}/api/refworks?pids=${pids.join(
      ","
    )}`,
    endnote: `http://www.myendnoteweb.com/EndNoteWeb.html?func=directExport&partnerName=bibliotek.dk&dataIdentifier=1&dataRequestUrl=${APP_URL}/api/ris?pids=${pids.join(
      ","
    )}`,
    file: `${APP_URL}/api/risdownload?pids=${pids.join(",")}`,
  };
};

export default function LinksList({ pids, disabled = false }) {
  const links = onlinelinks(pids);

  return Object.keys(links).map((onlinekey) => (
    <li className={styles.list} key={onlinekey}>
      <span
        className={cx({
          [styles.linkWrapperDisabled]: disabled,
        })}
      >
        <Link
          className={styles.link}
          dataCy={onlinekey}
          border={{ bottom: { keepVisible: true } }}
          href={links[onlinekey]}
          target="_blank"
          disabled={disabled}
        >
          <Text type="text3" tag="span">
            {Translate({ context: "references", label: `${onlinekey}_label` })}
          </Text>
        </Link>
      </span>

      <Text type="text3">
        {Translate({
          context: "references",
          label: `${onlinekey}_description_label`,
        })}
      </Text>
    </li>
  ));
}

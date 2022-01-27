import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";
import Top from "@/components/_modal/pages/base/top";
import styles from "./References.module.css";
import getConfig from "next/config";

const onlinelinks = (pid) => {
  const APP_URL =
    getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

  return {
    refworks: `http://www.refworks.com/express/ExpressImport.asp?vendor=bibliotek.dk&filter=RefWorks Tagged Format&encoding=28591&url=${APP_URL}/api/refworks?pid=${pid}`,
    endnote: `http://www.myendnoteweb.com/EndNoteWeb.html?func=directExport&partnerName=bibliotek.dk&dataIdentifier=1&dataRequestUrl=${APP_URL}/api/ris?pid=${pid}`,
    file: `${APP_URL}/api/risdownload?pid=${pid}`,
  };
};

export function References(pid) {
  const links = onlinelinks(pid);
  const linkslist = Object.keys(links).map((onlinekey) => (
    <li className={styles.list}>
      <Link
        dataCy={onlinekey}
        border={{ bottom: { keepVisible: true } }}
        href={links[onlinekey]}
        target="_blank"
      >
        <Text type="text3">
          {Translate({ context: "references", label: `${onlinekey}_label` })}
        </Text>
      </Link>
      <Text type="text3">
        {Translate({
          context: "references",
          label: `${onlinekey}_description_label`,
        })}
      </Text>
    </li>
  ));
  return (
    <div className={styles.options}>
      <Top
        title={Translate({
          context: "references",
          label: "label_references_title",
        })}
      />
      <ul>{linkslist}</ul>
    </div>
  );
}

export default function wrap({ context }) {
  const { pids } = context;
  return References(pids[0]);
}

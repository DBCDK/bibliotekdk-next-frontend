import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";
import Top from "@/components/_modal/pages/base/top";
import styles from "./References.module.css";
import getConfig from "next/config";
import Edition from "@/components/_modal/pages/edition/Edition";

const onlinelinks = (pid) => {
  const APP_URL =
    getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

  return {
    refworks: `http://www.refworks.com/express/ExpressImport.asp?vendor=bibliotek.dk&filter=RefWorks Tagged Format&encoding=28591&url=${APP_URL}/api/refworks?pids=${pid}`,
    endnote: `http://www.myendnoteweb.com/EndNoteWeb.html?func=directExport&partnerName=bibliotek.dk&dataIdentifier=1&dataRequestUrl=${APP_URL}/api/ris?pids=${pid}`,
    file: `${APP_URL}/api/risdownload?pids=${pid}`,
  };
};

export function References({ context }) {
  const links = onlinelinks(context?.pids[0]);

  const linkslist = Object.keys(links).map((onlinekey) => (
    <li className={styles.list} key={onlinekey}>
      <Link
        dataCy={onlinekey}
        border={{ bottom: { keepVisible: true } }}
        href={links[onlinekey]}
        target="_blank"
      >
        <Text type="text3" tag="span">
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
    <div>
      <Top
        className={{
          top: styles.top,
        }}
        title={Translate({
          context: "references",
          label: "label_references_title",
        })}
      />
      <div className={styles.item}>
        <Edition
          context={context}
          singleManifestation={true}
          showOrderTxt={false}
          showChangeManifestation={false}
        />
      </div>

      <ul className={styles.options}>{linkslist}</ul>
    </div>
  );
}

export default function Wrap({ context }) {
  return <References context={{ ...context, orderPids: context.pids }} />;
}

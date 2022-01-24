import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";

const onlinelinks = (pid) => {
  const selfurl = "http://localhost:3000";
  return {
    refworks: `http://www.refworks.com/express/ExpressImport.asp?vendor=bibliotek.dk&filter=RefWorks Tagged Format&encoding=28591&url=${selfurl}/api/refworks?pid=${pid}`,
    endnote: `http://www.myendnoteweb.com/EndNoteWeb.html?func=directExport&partnerName=bibliotek.dk&dataIdentifier=1&dataRequestUrl=${selfurl}/api/ris?pid=${pid}`,
    file: `${selfurl}/api/risdownload?pid=${pid}`,
  };
};

export default function References({ pid }) {
  const links = onlinelinks(pid);
  const linkslist = Object.keys(links).map((onlinekey) => (
    <li>
      <Link
        dataCy={onlinekey}
        border={{ bottom: { keepVisible: true } }}
        href={links[onlinekey]}
        target="_blank"
      >
        <Text type="text1">
          {Translate({ context: "references", label: `${onlinekey}_label` })}
        </Text>
      </Link>
    </li>
  ));
  return <ul>{linkslist}</ul>;
}

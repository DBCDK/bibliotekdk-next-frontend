import { useData } from "@/lib/api/api";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments.js";

export function getPublishedHelpTexts() {
  const { isLoading, data } = useData(publishedHelptexts());
  const helptexts = data && data.nodeQuery && data.nodeQuery.entities;

  return { helptexts };
}

export function HelpText({ helptexts }) {
  if (helptexts) {
    console.log(helptexts, "HELPTXT");
  }

  return <div>hest</div>;
}

export default function Wrapper(props) {
  const { helptexts } = getPublishedHelpTexts();
  return <HelpText {...props} helptexts={helptexts} />;
}

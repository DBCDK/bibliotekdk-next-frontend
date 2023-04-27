/**
 * @file ManifestationContent.js
 * Show manifesttionParts in modal
 */
import Top from "@/components/_modal/pages/base/top";
import Edition from "@/components/_modal/pages/edition/Edition";
import ManifestationParts from "@/components/manifestationparts/ManifestationParts";

export default function ManifestationContent(props) {
  const { pid, showOrderTxt, singleManifestation, parts } = props.context;

  return (
    <div>
      <Top />
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
      />
    </div>
  );
}

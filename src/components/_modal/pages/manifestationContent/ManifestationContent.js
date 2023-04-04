import Top from "@/components/_modal/pages/base/top";
import Edition from "@/components/_modal/pages/edition/Edition";
import ManifestationParts from "@/components/manifestationparts/ManifestationParts";

export default function ManifestationContent(props) {
  const { pid, showOrderTxt, singleManifestation } = props.context;

  const fisk = { orderPids: [pid] };

  return (
    <div>
      <Top />
      <Edition
        showOrderTxt={showOrderTxt}
        singleManifestation={singleManifestation}
        context={fisk}
      />
      <ManifestationParts pid={pid} showMoreButton={false} titlesOnly={false} />
    </div>
  );
}

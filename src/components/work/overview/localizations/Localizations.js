import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { useModal } from "@/components/_modal";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";

function Localizations({ count }) {
  return (
    <Text type="text3">
      {Translate({
        context: "overview",
        label: "label_library_holdings",
        vars: [count],
      })}
    </Text>
  );
}

export default function wrap({ selectedMaterial, workId }) {
  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.localizations({ workId })
  );

  if (isLoading) {
    return <Skeleton lines={1} />;
  }

  const modal = useModal();
  const openLocalizationsModal = () => {
    modal.push("localizations", {
      title: Translate({ context: "modal", label: "title-order" }),
      workId,
    });
  };
  const selectedLocalizations = data?.work?.materialTypes?.filter(
    (mat) => mat.materialType === selectedMaterial.materialType
  )[0];

  return (
    <Localizations
      count={selectedLocalizations?.localizations?.count.toString() || 0}
    />
  );
}

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { useModal } from "@/components/_modal";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import Link from "@/components/base/link";
import useUser from "@/components/hooks/useUser";
import { cyKey } from "@/utils/trim";

export function LocalizationsLink({
  materialType,
  localizations,
  opener,
  user,
}) {
  const nolinktoholding = [
    "Lydbog (bånd)",
    "Lydbog (net)",
    "Ebog",
    "Punktskrift",
    "Artikel",
    "Tidsskriftsartikel",
  ];

  if (nolinktoholding.includes(materialType)) {
    return null;
  }

  // @TODO - if user is logged in - show localizations for logged in library

  const count = localizations?.count?.toString() || "0";
  const localizationKey = cyKey({ name: "nolocalizations", prefix: "text" });
  const localizationLinkKey = cyKey({ name: "localizations", prefix: "link" });
  if (count === "0") {
    return (
      <div>
        <Text type="text3" dataCy={localizationKey}>
          {Translate({
            context: "overview",
            label: "label_library_no_holdings",
          })}
        </Text>
      </div>
    );
  }

  return (
    <span>
      <Link
        onClick={() => opener()}
        border={{ top: false, bottom: { keepVisible: true } }}
        dataCy={localizationLinkKey}
        ariaLabel="open localizations"
      >
        <Text type="text3">
          {Translate({
            context: "overview",
            label: "label_library_holdings",
            vars: [count],
          })}
        </Text>
      </Link>
    </span>
  );
}

export default function wrap({ selectedMaterial, workId }) {
  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.localizations({ workId })
  );

  // @TODO if user is logged in - do a holdingsitems request on user agency
  const user = useUser();

  // get pids from selected material to look up detailed holdings
  const pids = selectedMaterial?.manifestations?.map((mani) => mani.pid);

  const modal = useModal();
  const openLocalizationsModal = () => {
    modal.push("localizations", {
      title: Translate({ context: "modal", label: "title-order" }),
      workId,
      materialType: selectedMaterial.materialType,
      pids: pids,
    });
  };
  const selectedLocalizations = data?.work?.materialTypes?.filter(
    (mat) => mat.materialType === selectedMaterial.materialType
  )[0];

  if (isLoading) {
    return <Skeleton lines={1} />;
  }
  return (
    <LocalizationsLink
      materialType={selectedMaterial.materialType}
      localizations={selectedLocalizations?.localizations || "0"}
      opener={openLocalizationsModal}
      user={user}
    />
  );
}

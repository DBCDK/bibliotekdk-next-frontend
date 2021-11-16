import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { useModal } from "@/components/_modal";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import Link from "@/components/base/link";
import useUser from "@/components/hooks/useUser";

export function LocalizationsLink({ count, opener, user }) {
  console.log(user, "USER");

  if (count === "0") {
    return (
      <div>
        <Text type="text3">
          {Translate({
            context: "overview",
            label: "label_library_no_holdings",
          })}
        </Text>
      </div>
    );
  }

  return (
    <div>
      <Link
        onClick={() => opener()}
        border={{ top: false, bottom: { keepVisible: true } }}
      >
        <Text type="text3">
          {Translate({
            context: "overview",
            label: "label_library_holdings",
            vars: [count],
          })}
        </Text>
      </Link>
    </div>
  );
}

export default function wrap({ selectedMaterial, workId }) {
  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.localizations({ workId })
  );

  // @TODO if user is logged in - do a holdingsitems request on user agency
  const user = useUser();

  const modal = useModal();
  const openLocalizationsModal = () => {
    modal.push("localizations", {
      title: Translate({ context: "modal", label: "title-order" }),
      workId,
      materialType: selectedMaterial.materialType,
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
      count={selectedLocalizations?.localizations?.count.toString() || "0"}
      opener={openLocalizationsModal}
      user={user}
    />
  );
}

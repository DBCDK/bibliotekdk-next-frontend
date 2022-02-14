import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { useModal } from "@/components/_modal";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import Link from "@/components/base/link";
import useUser from "@/components/hooks/useUser";
import { cyKey } from "@/utils/trim";
import styles from "./LocalizationsLink.module.css";
import { preferredOnline } from "@/lib/Navigation";

export function LocalizationsLink({
  materialType,
  localizations,
  opener,
  user,
  isLoading,
}) {
  if (isLoading) {
    return <Skeleton lines={1} className={styles.skeletonstyle} />;
  }

  // @see lib/Navigation.js :: preferredOnline
  if (preferredOnline.includes(materialType)) {
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
    <>
      <Text type="text3" className={styles.linkstyle} tag="span">
        {Translate({
          context: "overview",
          label: "label_library_holdings",
          vars: [count],
        })}
        &nbsp;-&nbsp;
      </Text>
      <Link
        onClick={() => opener()}
        border={{ top: false, bottom: { keepVisible: true } }}
        dataCy={localizationLinkKey}
        ariaLabel="open localizations"
      >
        <Text type="text3" className={styles.linkstyle}>
          {Translate({
            context: "overview",
            label: "check_branch_holding",
            vars: [count],
          })}
        </Text>
      </Link>
    </>
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

  return (
    <LocalizationsLink
      materialType={selectedMaterial.materialType}
      localizations={selectedLocalizations?.localizations || "0"}
      opener={openLocalizationsModal}
      user={user}
      isLoading={isLoading}
    />
  );
}

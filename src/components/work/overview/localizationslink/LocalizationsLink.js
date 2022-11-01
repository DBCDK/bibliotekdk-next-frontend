import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as localizationsFragments from "@/lib/api/localizations.fragments";
import { useModal } from "@/components/_modal";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import styles from "./LocalizationsLink.module.css";
import { checkPreferredOnline } from "@/lib/Navigation";
import { openLocalizationsModal } from "@/components/work/utils";
import { useWorkFromSelectedPids } from "@/components/hooks/useWorkAndSelectedPids";

export function LocalizationsLink({
  materialType,
  localizations,
  openLocalizationsModal,
  isLoading,
}) {
  if (isLoading) {
    return <Skeleton lines={1} className={styles.skeletonstyle} />;
  }

  // @see lib/Navigation.js :: preferredOnline
  if (checkPreferredOnline(materialType)) {
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
        onClick={() => openLocalizationsModal()}
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

export default function Wrap({ selectedPids, workId }) {
  // @TODO if user is logged in - do a holdingsitems request on user agency
  // const user = useUser();
  const modal = useModal();

  const workFragment = workId && workFragments.pidsAndMaterialTypes({ workId });
  const workFromSelectedPids = useWorkFromSelectedPids(
    workFragment,
    selectedPids
  );

  const { data, isLoading } = useData(
    selectedPids &&
      localizationsFragments.localizationsQuery({ pids: selectedPids })
  );

  const materialType = workFromSelectedPids?.materialTypes?.[0]?.specific;

  return (
    <LocalizationsLink
      materialType={materialType}
      localizations={data?.localizations || "0"}
      openLocalizationsModal={() =>
        openLocalizationsModal(modal, selectedPids, workId, materialType)
      }
      isLoading={isLoading}
    />
  );
}

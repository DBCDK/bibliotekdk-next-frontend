import { useData } from "@/lib/api/api";
import * as localizationsFragments from "@/lib/api/localizations.fragments";
import { useModal } from "@/components/_modal";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import styles from "./LocalizationsLink.module.css";
import { openAgencyLocalizationsModal } from "@/components/work/utils";
import { AccessEnum } from "@/lib/enums";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";
import { useManifestationData } from "@/components/hooks/order";

export function LocalizationsLink({
  localizationsCount,
  openLocalizationsModal,
}) {
  // @TODO - if user is logged in - show localizations for logged in library
  const localizationKey = cyKey({ name: "nolocalizations", prefix: "text" });
  const localizationLinkKey = cyKey({ name: "localizations", prefix: "link" });

  if (localizationsCount === 0) {
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
          label:
            localizationsCount === 1
              ? "label_library_holdings-singular"
              : "label_library_holdings",
          vars: [localizationsCount],
        })}
        &nbsp;-&nbsp;
      </Text>
      <Link
        onClick={() => openLocalizationsModal()}
        border={{ top: false, bottom: { keepVisible: true } }}
        dataCy={localizationLinkKey}
        ariaLabel="open localizations"
      >
        <Text tag={"span"} type="text3" className={styles.linkstyle}>
          {Translate({
            context: "overview",
            label: "check_branch_holding",
            vars: [localizationsCount],
          })}
        </Text>
      </Link>
    </>
  );
}

export default function Wrap({ selectedPids, singleManifestation = false }) {
  // @TODO if user is logged in - do a holdingsitems request on user agency
  const { loanerInfo } = useLoanerInfo();
  const modal = useModal();

  const { access } = useManifestationAccess({ pids: selectedPids });

  const { physicalPids, isLoading: isLoadingManifestationData } =
    useManifestationData({ pids: selectedPids });

  const preferredOnline =
    access?.[0]?.__typename !== AccessEnum.INTER_LIBRARY_LOAN;

  const { data, isLoading, isSlow } = useData(
    !preferredOnline &&
      physicalPids?.length > 0 &&
      typeof physicalPids?.[0] !== "undefined" &&
      localizationsFragments.localizationsQuery({ pids: physicalPids })
  );

  if (preferredOnline) {
    return null;
  }

  if (isLoading || isLoadingManifestationData || !data) {
    return (
      <Skeleton lines={1} className={styles.skeletonstyle} isSlow={isSlow} />
    );
  }

  return (
    <LocalizationsLink
      localizationsCount={data?.localizations?.count || 0}
      openLocalizationsModal={() =>
        openAgencyLocalizationsModal({
          modal: modal,
          pids: physicalPids,
          agency: loanerInfo?.agency,
          singleManifestation: singleManifestation,
        })
      }
    />
  );
}

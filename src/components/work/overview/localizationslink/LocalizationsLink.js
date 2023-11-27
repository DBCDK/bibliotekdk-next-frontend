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
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { accessFactory } from "@/lib/accessFactoryUtils";
import { AccessEnum } from "@/lib/enums";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

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
          label: "label_library_holdings",
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

export default function Wrap({
  selectedPids,
  singleManifestation = false,
  modalOpener = (modal, agency) =>
    openAgencyLocalizationsModal({
      modal: modal,
      pids: selectedPids,
      agency: agency,
      singleManifestation: singleManifestation,
    }),
}) {
  // @TODO if user is logged in - do a holdingsitems request on user agency
  const { loanerInfo } = useLoanerInfo();
  const modal = useModal();

  const manifestationResponse = useData(
    selectedPids &&
      manifestationFragments.manifestationsForAccessFactory({
        pid: selectedPids,
      })
  );

  const manifestations = manifestationResponse?.data?.manifestations;
  const { allEnrichedAccesses } = accessFactory(manifestations);

  const preferredOnline =
    allEnrichedAccesses?.[0]?.__typename !== AccessEnum.INTER_LIBRARY_LOAN;

  const { data, isLoading, isSlow } = useData(
    !preferredOnline &&
      selectedPids?.length > 0 &&
      typeof selectedPids?.[0] !== "undefined" &&
      localizationsFragments.localizationsQuery({ pids: selectedPids })
  );

  if (preferredOnline) {
    return null;
  }

  if (isLoading || !data || manifestationResponse?.isLoading) {
    return (
      <Skeleton lines={1} className={styles.skeletonstyle} isSlow={isSlow} />
    );
  }

  return (
    <LocalizationsLink
      localizationsCount={data?.localizations?.count || 0}
      openLocalizationsModal={() => modalOpener(modal, loanerInfo?.agency)}
    />
  );
}

import styles from "./Options.module.css";
import Top from "../base/top";
import { getTemplateProps } from "@/components/_modal/pages/options/Options.helper";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { useOrderFlow } from "@/components/hooks/order";
import { useModal } from "@/components/_modal";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { openLoginModal } from "../login/utils";
import { _isFFUAgency } from "@/utils/agency";
import Translate from "@/components/base/translate";
import { setLoginIntent } from "@/components/work/reservationbutton/utils";

/**
 * Component helper for link and description in options
 * @param props
 * @param templateProps
 * @returns {React.JSX.Element}
 */
export function OptionsLinkAndDescription({ props, templateProps }) {
  const { className } = props;
  const { linkProps = {}, linkText = "", descriptionText = "" } = templateProps;

  return (
    <li className={`${className} ${styles.item}`}>
      <Link border={{ bottom: { keepVisible: true } }} {...linkProps}>
        <Text type="text1" tag="span">
          {linkText}
        </Text>
      </Link>
      <Text type="text3">{descriptionText}</Text>
    </li>
  );
}

/**
 * OptionsListPrototyper is used for injecting modal and workId
 * before used inside main code
 * @param modal
 * @param workId
 * @param access
 * @param index
 * @param accessesArray
 * @returns {React.JSX.Element}
 */
function optionsListAllArgs({
  access,
  index,
  selectedPids,
  manifestations,
  startOrderFlow,
  loginPrompt,
  statusPrompt,
  setIntent,
  isAuthenticated,
}) {
  //add order modal to store, to be able to access when coming back from adgangsplatform/mitid?
  const currentManifestation = manifestations?.find(
    (mani) => mani.pid === access.pids[0]
  );

  const materialTypeArray = currentManifestation?.materialTypes.map(
    (type) => type.materialTypeSpecific.display
  );

  const props = {
    ...access,
    materialTypesArray: materialTypeArray,
    isAuthenticated,
    className: styles.item,
    onOrder: () => {
      startOrderFlow({ orders: [{ pids: selectedPids }] });
    },
    onSetIntent: (pid) => setIntent(pid),
    onLoginPrompt: (redirectPath) => loginPrompt(redirectPath),
    onErrorPrompt: () => statusPrompt(),
  };

  return (
    <OptionsLinkAndDescription
      key={access.accessType + "-" + index}
      props={props}
      templateProps={getTemplateProps[access?.__typename](props)}
    />
  );
}

export function Options({ context }) {
  const { title, selectedPids } = { ...context };
  const { start } = useOrderFlow();

  const modal = useModal();

  const { isAuthenticated, isFolkUser } = useAuthentication();

  const { access } = useManifestationAccess({
    pids: selectedPids,
  });

  const manifestationResponse = useData(
    selectedPids &&
      manifestationFragments.alternativesManifestations({ pid: selectedPids })
  );

  const manifestations = manifestationResponse?.data?.manifestations;

  const titleLabel = isFolkUser
    ? "hasfolk-missing-url-title"
    : "nofolk-missing-url-title";

  const textLabel = isFolkUser
    ? "hasfolk-missing-url-text"
    : "nofolk-missing-url-text";

  const optionsList = (access, index) =>
    optionsListAllArgs({
      access,
      index,
      selectedPids,
      manifestations,
      isAuthenticated,
      loginPrompt: (redirectPath = null) =>
        openLoginModal({ modal, redirectPath }),
      setIntent: async (pid) =>
        setLoginIntent({ pid, provider: "Options_Publizon" }),
      statusPrompt: () =>
        modal.push("statusMessage", {
          title: Translate({
            context: "publizon",
            label: titleLabel,
            renderAsHtml: true,
          }),
          text: Translate({
            context: "publizon",
            label: textLabel,
            renderAsHtml: true,
          }),
        }),
      startOrderFlow: start,
    });

  return (
    // allowedAccessessByType && (
    <div className={styles.options}>
      <Top title={title} />
      <ul className={styles.list} key="options-ul">
        {access?.map(optionsList)}
      </ul>
    </div>
    // )
  );
}

export default function Wrap(props) {
  return <Options {...props} />;
}

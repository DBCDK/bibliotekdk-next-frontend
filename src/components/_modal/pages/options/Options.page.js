import styles from "./Options.module.css";
import Top from "../base/top";
import {
  openOrderModal,
  useBranchUserAndHasDigitalAccess,
} from "@/components/work/utils";
import { getTemplateProps } from "@/components/_modal/pages/options/Options.helper";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { useMemo } from "react";
import { accessFactory } from "@/lib/accessFactoryUtils";
import useUser from "@/components/hooks/useUser";
import { openLoginModal } from "@/components/_modal/pages/login/utils";

/**
 * Component helper for link and description in options
 * @param props
 * @param templateProps
 * @returns {React.JSX.Element}
 */
export function OptionsLinkAndDescription({ props, templateProps }) {
  const { className } = props;
  const { linkProps, linkText, descriptionText } = templateProps;

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

async function handleOpenLoginAndOrderModal(modal, modalprops) {
  const uid = await modal.saveToStore("order", {
    ...modalprops,
    storeLoanerInfo: true,
  });
  //open actual loginmodal
  openLoginModal({
    modal,
    //data used for FFU without adgangsplatform to open order modal directly
    ...modalprops,
    //callback used for adgangsplatform/mitid login to open order modal on redirect
    callbackUID: uid,
  });
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
function optionsListAllArgs(modal, workId, access, index, accessesArray, user) {
  //add order modal to store, to be able to access when coming back from adgangsplatform/mitid?
  const orderModalProps = {
    pids: accessesArray?.map((singleAccess) => singleAccess.pid),
    selectedAccesses: [access],
    workId: workId,
    singleManifestation: true,
  };

  const props = {
    ...access,
    className: styles.item,
    onOrder: () => {
      user?.isAuthenticated || user.isGuestUser
        ? openOrderModal({
            modal: modal,
            ...orderModalProps,
          })
        : handleOpenLoginAndOrderModal(modal, orderModalProps);
    },
  };

  return (
    <OptionsLinkAndDescription
      key={access.accessType + "-" + index}
      props={props}
      templateProps={getTemplateProps[access?.__typename](props)}
    />
  );
}

export function Options({ modal, context, user }) {
  const { title, selectedPids, workId } = { ...context };

  const manifestationResponse = useData(
    selectedPids &&
      manifestationFragments.alternativesManifestations({ pid: selectedPids })
  );

  const manifestations = manifestationResponse?.data?.manifestations;

  // the next one checks for digital access .. for users already logged in :)
  // it is false if user is not logged in
  const hasDigitalAccess = user?.rights?.digitalArticleService;

  const { getAllowedAccessesByTypeName } = useMemo(() => {
    return accessFactory(manifestations);
  }, [manifestations]);

  const allowedAccessessByType = getAllowedAccessesByTypeName(
    hasDigitalAccess || !user?.isAuthenticated
  );

  const onlineAccesses = allowedAccessessByType.onlineAccesses;
  const digitalArticleServiceAccesses =
    allowedAccessessByType.digitalArticleServiceAccesses;
  const interLibraryLoanAccesses =
    digitalArticleServiceAccesses.length > 0
      ? []
      : allowedAccessessByType.interLibraryLoanAccesses;
  const specialAccesses = allowedAccessessByType.specialAccesses;

  const optionsList = (access, index, accessesArray) =>
    optionsListAllArgs(modal, workId, access, index, accessesArray, user);

  return (
    allowedAccessessByType && (
      <div className={styles.options}>
        <Top title={title} />
        <ul className={styles.list} key="options-ul">
          {onlineAccesses.map(optionsList)}
          {digitalArticleServiceAccesses.slice(0, 1).map(optionsList)[0]}
          {interLibraryLoanAccesses.map(optionsList)[0]}
          {specialAccesses.map(optionsList)}
        </ul>
      </div>
    )
  );
}

export default function Wrap(props) {
  const user = useUser();
  return <Options {...{ ...props, user }} />;
}

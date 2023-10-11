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
function optionsListAllArgs(modal, workId, access, index, accessesArray) {
  const props = {
    ...access,
    className: styles.item,
    onOrder: () =>
      openOrderModal({
        modal: modal,
        pids: accessesArray?.map((singleAccess) => singleAccess.pid),
        selectedAccesses: [access],
        workId: workId,
        singleManifestation: true,
      }),
  };

  return (
    <OptionsLinkAndDescription
      key={access.accessType + "-" + index}
      props={props}
      templateProps={getTemplateProps[access?.__typename](props)}
    />
  );
}

export function Options({ modal, context }) {
  const { title, selectedPids, workId } = { ...context };

  const manifestationResponse = useData(
    selectedPids &&
      manifestationFragments.alternativesManifestations({ pid: selectedPids })
  );

  const manifestations = manifestationResponse?.data?.manifestations;

  const { hasDigitalAccess } = useBranchUserAndHasDigitalAccess(selectedPids);

  const { getAllowedAccessesByTypeName } = useMemo(() => {
    return accessFactory(manifestations);
  }, [manifestations]);

  const allowedAccessessByType = getAllowedAccessesByTypeName(hasDigitalAccess);

  const onlineAccesses = allowedAccessessByType.onlineAccesses;
  const digitalArticleServiceAccesses =
    allowedAccessessByType.digitalArticleServiceAccesses;
  const interLibraryLoanAccesses =
    digitalArticleServiceAccesses.length > 0
      ? []
      : allowedAccessessByType.interLibraryLoanAccesses;
  const specialAccesses = allowedAccessessByType.specialAccesses;

  const optionsList = (access, index, accessesArray) =>
    optionsListAllArgs(modal, workId, access, index, accessesArray);

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
  return <Options {...props} />;
}

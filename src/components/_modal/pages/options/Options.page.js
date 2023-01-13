import styles from "./Options.module.css";
import Top from "../base/top";
import {
  openOrderModal,
  useBranchUserAndHasDigitalAccess,
} from "@/components/work/utils";
import {
  specialSort,
  getTemplateProps,
} from "@/components/_modal/pages/options/Options.helper";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { useMemo } from "react";
import { accessFactory } from "@/lib/accessFactoryUtils";

export function OptionsLinkAndDescription({ props, templateProps }) {
  const { note, className } = props;
  const { linkProps, linkText, descriptionText } = templateProps;

  return (
    <li className={`${className} ${styles.item}`}>
      <Link border={{ bottom: { keepVisible: true } }} {...linkProps}>
        <Text type="text1">{linkText}</Text>
      </Link>
      {note && <Text type="text3">{note}</Text>}
      <Text type="text3">{descriptionText}</Text>
    </li>
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

  const allowedAccesses = [
    ...allowedAccessessByType.onlineAccesses,
    ...allowedAccessessByType.digitalArticleServiceAccesses,
    ...allowedAccessessByType.interLibraryLoanAccesses,
  ];

  // quickfix - sort links from filmstriben - we want fjernleje on top
  const orderedAccess = allowedAccesses?.sort(specialSort);

  return (
    orderedAccess && (
      <div className={styles.options}>
        <Top title={title} />
        <ul className={styles.list} key="options-ul">
          {orderedAccess.map((access, index) => {
            const props = {
              ...access,
              className: styles.item,
              onOrder: () =>
                openOrderModal({
                  modal: modal,
                  pids: [access?.pid],
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
          })}
        </ul>
      </div>
    )
  );
}

export default function Wrap(props) {
  return <Options {...props} />;
}

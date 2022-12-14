import styles from "./Options.module.css";
import Top from "../base/top";
import { openOrderModal } from "@/components/work/utils";
import {
  specialSort,
  getTemplateProps,
} from "@/components/_modal/pages/options/Options.helper";
import Link from "@/components/base/link";
import Text from "@/components/base/text";

export function OptionsLinkAndDescription({ props, templateProps }) {
  const { note, className } = { ...props };

  return (
    <li className={`${className} ${styles.item}`}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        {...templateProps.linkProps}
      >
        <Text type="text1">{templateProps.linkText}</Text>
      </Link>
      {note && <Text type="text3">{note}</Text>}
      <Text type="text3">{templateProps.descriptionText}</Text>
    </li>
  );
}

export function Options({ modal, context }) {
  const { allowedAccesses } = { ...context };

  // no type selected - get the first one
  const type = context.type;

  // quickfix - sort links from filmstriben - we want fjernleje on top
  const orderedOnlineAccess = allowedAccesses?.sort(specialSort);

  return (
    orderedOnlineAccess && (
      <div className={styles.options}>
        <Top title={context.title} />
        <ul className={styles.list} key="options-ul">
          {orderedOnlineAccess.map((access, index) => {
            const props = {
              ...access,
              className: styles.item,
              materialType: type,
              onOrder: () =>
                openOrderModal(modal, context.workId, "singleManifestation", {
                  pid: access?.pid,
                  materialTypes: { specific: type },
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

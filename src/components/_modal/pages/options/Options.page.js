import styles from "./Options.module.css";
import Top from "../base/top";
import { openOrderModal } from "@/components/work/utils";
import {
  specialSort,
  getTemplateProps,
} from "@/components/_modal/pages/options/Options.helper";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { formatMaterialTypesToPresentation } from "@/lib/manifestationFactoryFunctions";

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
  const { allowedAccesses } = { ...context };

  // quickfix - sort links from filmstriben - we want fjernleje on top
  const orderedOnlineAccess = allowedAccesses?.sort(specialSort);

  return (
    orderedOnlineAccess && (
      <div className={styles.options}>
        <Top title={context.title} />
        <ul className={styles.list} key="options-ul">
          {orderedOnlineAccess.map((access, index) => {
            console.log(
              "access.materialTypesArray: ",
              formatMaterialTypesToPresentation(
                access?.materialTypesArray
              ).join("")
            );

            const props = {
              ...access,
              className: styles.item,
              onOrder: () =>
                openOrderModal(
                  modal,
                  access?.pid,
                  context.workId,
                  "singleManifestation"
                ),
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

import Text from "@/components/base/text";
import { IconLink } from "@/components/base/iconlink/IconLink";
import Icon from "@/components/base/icon/Icon";
import styles from "./ChoosePeriodicaCopyRow.module.css";
import ChevronRight from "@/public/icons/chevron_right.svg";
import Translate from "@/components/base/translate";

/**
 * Shows a button to open the periodica form modal
 * button text depends on if the user has already filled out the form or not
 * @param {Object} periodicaForm
 * @param {Object} modal
 * @param {String} articleTypeTranslation
 * @returns
 */
export default function ChoosePeriodicaCopyRow({
  periodicaForm,
  modal,
  articleTypeTranslation,
}) {
  return (
    <>
      {articleTypeTranslation ? (
        <div className={styles.articletype}>
          <Text type="text4">{Translate(articleTypeTranslation)}</Text>
        </div>
      ) : null}
      {periodicaForm && (
        <div>
          {Object.entries(periodicaForm).map(([key, value]) => (
            <span key={key} className={styles.periodicaformfield}>
              <Text type="text3">
                {Translate({
                  context: "order-periodica",
                  label: `label-${key}`,
                })}
              </Text>
              <Text type="text4" key={key}>
                {": "}
                {value}
              </Text>
            </span>
          ))}
        </div>
      )}
      <div className={styles.choosePeriodicaCopyRow}>
        {!periodicaForm && (
          <Icon
            src="exclamationmark.svg"
            alt="info"
            data-cy="tooltip-icon"
            size="2_5"
            className={styles.exclamationmark}
          />
        )}
        <IconLink
          onClick={() => {
            modal.push("periodicaform", {
              periodicaForm: periodicaForm,
            });
          }}
          className={styles.periodicaformlink}
          border={{ bottom: { keepVisible: true }, top: false }}
          tag={"button"}
          iconSrc={ChevronRight}
          iconPlacement={"right"}
        >
          {Translate({
            context: "order-periodica",
            label: periodicaForm ? "correct" : "title",
          })}
        </IconLink>
      </div>
    </>
  );
}

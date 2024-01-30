import React from "react";
import { useData } from "@/lib/api/api";
import { helpText } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import PropTypes from "prop-types";
import styles from "./HelpText.module.css";
import Breadcrumbs from "@/components/base/breadcrumbs/Breadcrumbs";
import BodyParser from "@/components/base/bodyparser/BodyParser";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate/Translate";

/**
 * Entry function for a helptext
 * @param helptext
 * @returns {React.ReactElement|null}
 */
export function HelpText({ helptext }) {
  if (helptext.title && helptext.body) {
    const helpText = Translate({ context: "help", label: "help-breadcrumb" });
    const path = [helpText, helptext.fieldHelpTextGroup];
    return (
      <React.Fragment>
        <div className={styles.helpbreadcrumb}>
          <Breadcrumbs path={path} href="/help" skeleton={false} />
        </div>
        <Title
          type="title4"
          className={styles.title}
          dataCy={"help-text-title"}
        >
          {helptext.title}
        </Title>
        <BodyParser body={helptext?.body?.value} dataCy={"help-text-body"} />
      </React.Fragment>
    );
  } else {
    return null;
  }
}
HelpText.propTypes = {
  helptext: PropTypes.object,
};

/**
 * Default export function for component
 * @param {string} helpTextId
 * @returns {React.ReactElement|null}
 */
export default function Wrap({ helpTextId }) {
  const { isLoading, data, error } = useData(
    helpTextId && helpText({ helpTextId: helpTextId })
  );

  if (isLoading) {
    return <Skeleton lines={2} className={styles.helpskeleton} />;
  }

  if (!data || !data?.nodeById || error) {
    // @TODO some error here .. message for user .. log ??
    return null;
  }

  return <HelpText helptext={data?.nodeById} />;
}
Wrap.propTypes = {
  helpTextId: PropTypes.string,
};

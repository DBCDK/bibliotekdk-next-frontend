import React from "react";
import { useData } from "@/lib/api/api";
import { helpText } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import PropTypes from "prop-types";
import styles from "./HelpText.module.css";
import Breadcrumbs from "@/components/base/breadcrumbs/Breadcrumbs";
import Skeleton from "@/components/base/skeleton";
import Translate from "@/components/base/translate/Translate";
import Markdown from "@/components/base/markdown/Markdown";

/**
 * Entry function for a helptext
 * @param helptext
 * @returns {React.ReactElement|null}
 */
export function HelpText({ helptext }) {
  if (helptext.title && helptext.body) {
    const helpText = Translate({ context: "help", label: "help-breadcrumb" });
    const path = [helpText, helptext.group];
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
        <Markdown body={helptext.body} dataCy="help-text-body" />
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

  if (!data || !data?.bibliotekdkCms?.helpText || error) {
    return null;
  }

  return <HelpText helptext={data.bibliotekdkCms.helpText} />;
}
Wrap.propTypes = {
  helpTextId: PropTypes.string,
};

import React from "react";
import { useData } from "@/lib/api/api";
import { helpText } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import PropTypes from "prop-types";
import styles from "./HelpText.module.css";
import Breadcrumbs from "@/components/base/breadcrumbs/Breadcrumbs";
import BodyParser from "@/components/base/bodyparser/BodyParser";
import Skeleton from "@/components/base/skeleton";

/**
 * Entry function for a helptext
 * @param helptext
 * @return {JSX.Element|null}
 * @constructor
 */
export function HelpText({ helptext }) {
  if (helptext.title && helptext.body) {
    const path = ["help", helptext.fieldHelpTextGroup];
    return (
      <React.Fragment>
        <div className={styles.helpbreadcrumb}>
          <Breadcrumbs path={path} href="/help" skeleton={false} />
        </div>
        <Title
          type="title4"
          className={styles.title}
          data-cy={"help-text-title"}
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
 * @return {JSX.Element|null}
 * @constructor
 */
export default function Wrap({ helpTextId }) {
  const { isLoading, data, error } = useData(
    helpTextId && helpText({ helpTextId: helpTextId })
  );

  if (isLoading) {
    return <Skeleton lines={2} />;
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

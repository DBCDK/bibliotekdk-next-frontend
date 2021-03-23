import { useData } from "@/lib/api/api";
import { helpText } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import PropTypes from "prop-types";
import styles from "./HelpTexts.module.css";
import Breadcrumbs from "@/components/base/breadcrumbs/Breadcrumbs";
import React from "react";
import BodyParser from "@/components/base/bodyparser/BodyParser";

/**
 * get a helptext by id from api
 * @param helpTextId
 * @return {{isLoading, data}}
 */
function getAhelpText({ helpTextId }) {
  const { isLoading, data } = useData(helpText({ helpTextId }));
  return { isLoading, data };
}

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
        <Title type="title4" className={styles.title}>
          {helptext.title}
        </Title>
        <BodyParser body={helptext?.body?.value} />
      </React.Fragment>
    );
  } else {
    return null;
  }
}

/**
 * Default export function for component
 * @param helpTextId
 * @return {JSX.Element|null}
 * @constructor
 */
export default function Wrap({ helpTextId }) {
  const { isLoading, data } = getAhelpText({ helpTextId });

  if (!data || !data.helptext) {
    // @TODO skeleton
    return null;
  }

  return <HelpText helptext={data.helptext} />;
}

HelpText.propTypes = {
  helptext: PropTypes.object,
};

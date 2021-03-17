import { useData } from "@/lib/api/api";
import { helpText } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import PropTypes from "prop-types";
import styles from "./HelpTexts.module.css";
import Breadcrumbs from "@/components/base/breadcrumbs/Breadcrumbs";
import React from "react";

/**
 * get a helptext by id from api
 * @param helpTextID
 * @return {{isLoading, data}}
 */
function getAhelpText({ helpTextID }) {
  const { isLoading, data } = useData(helpText(helpTextID));
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
    const path = ["help", helptext.title];
    return (
      <React.Fragment>
        <div className={styles.helpbreadcrumb}>
          <Breadcrumbs path={path} href="/help" skeleton={false} />
        </div>
        <Title type="title4">{helptext.title}</Title>
        <Text type="text2" lines={30} className={styles.helptext}>
          <span dangerouslySetInnerHTML={{ __html: helptext.body.value }} />
        </Text>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

/**
 * Default export function for component
 * @param helpTextID
 * @return {JSX.Element|null}
 * @constructor
 */
export default function Wrap({ helpTextID }) {
  const { isLoading, data } = getAhelpText({ helpTextID });
  if (!data || !data.helptext) {
    // @TODO skeleton
    return null;
  }

  return <HelpText helptext={data.helptext} />;
}

HelpText.propTypes = {
  helptext: PropTypes.object,
};

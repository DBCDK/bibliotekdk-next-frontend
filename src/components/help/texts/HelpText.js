import { useData } from "@/lib/api/api";
import { helpText } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import PropTypes from "prop-types";
import styles from "./HelpTexts.module.css";
import Breadcrumbs from "@/components/base/breadcrumbs/Breadcrumbs";
import React from "react";
import Skeleton from "@/components/base/skeleton";

/**
 * get a helptext by id from api
 * @param helpTextId
 * @return {{isLoading, data}}
 */
function getAhelpText({ helpTextId }) {
  const { isLoading, data, error } = useData(helpText({ helpTextId }));
  return { isLoading, data, error };
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
        <Title type="title4">{helptext.title}</Title>
        <Text type="text2" lines={30} className={styles.helptext}>
          <div dangerouslySetInnerHTML={{ __html: helptext.body.value }} />
        </Text>
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
  const { isLoading, data, error } = getAhelpText({ helpTextId });

  if (isLoading) {
    return <Skeleton lines={2} />;
  }

  if (!data || !data.helptext || error) {
    // @TODO some error here .. message for user .. log ??
    return null;
  }

  return <HelpText helptext={data.helptext} />;
}

HelpText.propTypes = {
  helptext: PropTypes.object,
};

import Router from "next/router";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

// templates
import Infomedia from "./templates/infomedia";
import Online from "./templates/online";

import styles from "./Options.module.css";
import Skeleton from "@/components/base/skeleton";

/**
 * Template selection function
 *
 * @param {string} template name of template
 *
 * @returns {component}
 */
function getTemplate(props) {
  if (props.infomediaId) {
    return <Infomedia props={props} />;
  }
  if (props.url) {
    return <Online {...props} />;
  }
}

export function Options({ data, title_author, isLoading, workId }) {
  if (isLoading) {
    return <Skeleton lines={3} className={styles.skeleton} />;
  }

  const onlineAccess =
    data?.work?.materialTypes[0]?.manifestations[0]?.onlineAccess;

  return (
    onlineAccess && (
      <div className={styles.options}>
        <ul className={styles.list}>
          {onlineAccess.map((i) => {
            return getTemplate({
              ...i,
              title_author: title_author,
              className: styles.item,
              workId,
            });
          })}
        </ul>
      </div>
    )
  );
}

export default function Wrap(props) {
  // order pid
  const { workId, title_author } = Router.query;

  // Fetch work data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.details({ workId })
  );

  if (error) {
    return <div>Error :( !!!!!</div>;
  }

  return (
    <Options
      data={data}
      title_author={title_author}
      isLoading={isLoading}
      workId={workId}
    />
  );
}

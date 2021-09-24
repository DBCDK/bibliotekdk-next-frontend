import Router from "next/router";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

// templates
import Infomedia from "./templates/infomedia";
import Online from "./templates/online";
import WebArchive from "./templates/webarchive";

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
  if (props.type === "webArchive") {
    return <WebArchive {...props} />;
  }
  if (props.infomediaId) {
    return <Infomedia props={props} />;
  }
  if (props.url) {
    return <Online {...props} />;
  }
}

export function Options({ data, title_author, isLoading, workId, type }) {
  if (isLoading) {
    return <Skeleton lines={3} className={styles.skeleton} />;
  }

  if (!type) {
    // no type selected - get the first one
    type = data?.work?.materialTypes?.[0].materialType;
  }
  // get the material by type
  const currentMaterial = data?.work?.materialTypes?.find(
    (material) => material.materialType === type
  );

  const onlineAccess = currentMaterial?.manifestations[0]?.onlineAccess;

  return (
    onlineAccess && (
      <div className={styles.options}>
        <ul className={styles.list}>
          {onlineAccess.map((i) => {
            return getTemplate({
              ...i,
              materialType: type,
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
  const { workId, title_author, type } = Router.query;

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
      type={type}
    />
  );
}

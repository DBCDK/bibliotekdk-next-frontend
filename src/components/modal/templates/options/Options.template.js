import Router from "next/router";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

// templates
import Infomedia from "./templates/infomedia";
import Online from "./templates/online";

import styles from "./Options.module.css";

/**
 * Template selection function
 *
 * @param {string} template name of template
 *
 * @returns {component}
 */
function getTemplate(props) {
  if (props.html) {
    return <Infomedia {...props} />;
  }
  if (props.url) {
    return <Online {...props} />;
  }
}

function Options({ data }) {
  console.log("data", data);

  const onlineAccess =
    data.work.materialTypes[0]?.manifestations[0]?.onlineAccess;

  console.log("onlineAccess", onlineAccess);

  return (
    <div className={styles.options}>
      <ul className={styles.list}>
        {onlineAccess.map((i) => {
          return getTemplate({ ...i, className: styles.item });
        })}
      </ul>
    </div>
  );
}

function OptionsSkeleton() {
  return <Options data={[]} isLoading={true} />;
}

export default function Wrap(props) {
  // order pid
  const { workId } = Router.query;

  console.log("workId", workId);

  // Fetch work data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.details({ workId })
  );

  if (isLoading) {
    return "loading ...";
    return <OptionSkeleton isSlow={isSlow} />;
  }

  if (error) {
    return <div>Error :( !!!!!</div>;
  }

  return <Options data={data} />;
}

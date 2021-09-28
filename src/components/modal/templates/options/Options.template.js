import Router from "next/router";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

// templates
import Infomedia from "./templates/infomedia";
import Online from "./templates/online";
import WebArchive from "./templates/webarchive";
import DigitalCopy from "./templates/digitalcopy";

import styles from "./Options.module.css";
import Skeleton from "@/components/base/skeleton";
import { sortBy } from "lodash";
import Translate from "@/components/base/translate";
import { Top } from "@/components/modal";

/**
 * Template selection function
 *
 * @param {string} template name of template
 *
 * @returns {component}
 */
function getTemplate(props) {
  if (props.accessType === "webArchive") {
    return <WebArchive {...props} />;
  }
  if (props.accessType === "infomedia") {
    return <Infomedia props={props} />;
  }
  if (props.accessType === "online") {
    return <Online {...props} />;
  }
  if (props.accessType === "digitalCopy") {
    return <DigitalCopy {...props} />;
  }
}

function sortorder(onlineaccess) {
  const realorder = ["online", "webArchive", "infomedia", "digitalCopy"];
  return sortBy(onlineaccess, function (item) {
    return realorder.indexOf(item.accessType);
  });
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

  const onlineAccess = addToOnlinAccess(
    currentMaterial?.manifestations[0]?.onlineAccess
  );

  const onClose = () => Router.back();

  const orderedOnlineAccess = sortorder(onlineAccess);

  return (
    onlineAccess && (
      <>
        <Top
          title={Translate({
            context: "modal",
            label: `title-order`,
          })}
          handleClose={onClose}
        />
        <div className={styles.options}>
          <ul className={styles.list}>
            {orderedOnlineAccess.map((i) => {
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
      </>
    )
  );
}

/**
 * infomedia url is specific for this gui - set an url on the online access object
 * @param onlineAccess
 * @return {*}
 */
function addToOnlinAccess(onlineAccess, title) {
  const addi = onlineAccess?.map((access) => {
    if (access.infomediaId) {
      access.accessType = "infomedia";
    } else if (access.issn) {
      access.accessType = "digitalCopy";
    } else if (access.type === "webArchive") {
      access.accessType = "webArchive";
    } else if (access.url) {
      access.accessType = "online";
    }
    return access;
  });

  return addi;
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

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

// templates
import Infomedia from "./templates/infomedia";
import Online from "./templates/online";
import WebArchive from "./templates/webarchive";
import DigitalCopy from "./templates/digitalcopy";
import PhysicalCopy from "./templates/physical";

import styles from "./Options.module.css";
import Skeleton from "@/components/base/skeleton";
import { sortBy } from "lodash";
import Translate from "@/components/base/translate";
import Top from "../base/top";

/**
 * Template selection function
 *
 * @param {string} template name of template
 *
 * @returns {component}
 */
function getTemplate(props) {
  if (props.accessType === "webArchive") {
    return <WebArchive {...props} key={props.listkey} />;
  }
  if (props.accessType === "infomedia") {
    return <Infomedia props={props} />;
  }
  if (props.accessType === "online") {
    return <Online {...props} key={props.listkey} />;
  }
  if (props.accessType === "digitalCopy") {
    return <DigitalCopy {...props} key={props.listkey} />;
  }
  if (props.accessType === "physical") {
    return <PhysicalCopy props={props} key={props.listkey} />;
  }
}

function sortorder(onlineaccess) {
  const realorder = [
    "online",
    "webArchive",
    "infomedia",
    "digitalCopy",
    "physical",
  ];
  return sortBy(onlineaccess, function (item) {
    return realorder.indexOf(item.accessType);
  });
}

/**
 * Enrich online access object with additinal info
 * @param onlineAccess
 *  Array of onlineaccess objects
 * @parm orderPossible
 *  Is it possible to order a physical copy?
 * @return {*}
 */
function addToOnlinAccess(onlineAccess = [], orderPossible) {
  const addi = onlineAccess?.map((access) => {
    const copy = { ...access };
    if (copy.infomediaId) {
      copy.accessType = "infomedia";
    } else if (copy.issn) {
      copy.accessType = "digitalCopy";
    } else if (copy.type === "webArchive") {
      copy.accessType = "webArchive";
    } else if (copy.url) {
      copy.accessType = "online";
    }
    return copy;
  });
  if (orderPossible) {
    addi.push({ accessType: "physical" });
  }

  return addi;
}

export function Options({ data, isLoading, modal, context }) {
  if (isLoading) {
    return <Skeleton lines={3} className={styles.skeleton} />;
  }

  // no type selected - get the first one
  const type = context.type || data?.work?.materialTypes?.[0].materialType;

  // get the material by type
  const currentMaterial = data?.work?.materialTypes?.find(
    (material) => material.materialType === type
  );

  const onlineAccess = addToOnlinAccess(
    currentMaterial?.manifestations[0]?.onlineAccess,
    context.orderPossible
  ).filter((access) => !access.issn);

  const orderedOnlineAccess = sortorder(onlineAccess);

  return (
    onlineAccess && (
      <div className={styles.options}>
        <Top title={context.title} />
        <ul className={styles.list} key="options-ul">
          {orderedOnlineAccess.map((access, index) => {
            return getTemplate({
              ...access,
              materialType: type,
              title_author: context.title_author,
              className: styles.item,
              workId: context.workId,
              modal: modal,
              listkey: access.accessType + "-" + index,
            });
          })}
        </ul>
      </div>
    )
  );
}

export default function Wrap(props) {
  const { workId } = props.context;
  // Fetch work data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.details({ workId })
  );

  if (error) {
    return <div>Error :( !!!!!</div>;
  }

  return <Options data={data} isLoading={isLoading} {...props} />;
}

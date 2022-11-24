// templates
import Infomedia from "./templates/infomedia";
import Online from "./templates/online";
import WebArchive from "./templates/webarchive";
import OrderLink from "./templates/orderlink";

import styles from "./Options.module.css";
import sortBy from "lodash/sortBy";
import Top from "../base/top";

/**
 * Template selection function
 *
 * @param {object} props props for template
 *
 * @returns {JSX.Element}
 */
function getTemplate(props) {
  if (props.accessType === "webArchive") {
    return <WebArchive {...props} key={props.listkey} />;
  }
  if (props.accessType === "infomedia") {
    return <Infomedia props={props} />;
  }
  if (props.accessType === "online") {
    return <Online props={props} key={props.listkey} />;
  }
  if (props.accessType === "digitalCopy") {
    return <OrderLink props={props} key={props.listkey} digitalOnly />;
  }
  if (props.accessType === "physical") {
    return <OrderLink props={props} key={props.listkey} />;
  }
  if (props.accessType === "combined") {
    return <OrderLink props={props} key={props.listkey} combined />;
  }
}

function sortorder(onlineaccess) {
  const realorder = [
    "online",
    "webArchive",
    "infomedia",
    "digitalCopy",
    "physical",
    "combined",
  ];
  return sortBy(onlineaccess, function (item) {
    return realorder.indexOf(item.accessType);
  });
}

/**
 * Enrich online access object with additinal info
 * @param onlineAccess Array of onlineaccess objects
 * @param orderPossible Is it possible to order a physical copy?
 * @return {*}
 */
function addToOnlineAccess(onlineAccess = [], orderPossible) {
  let addi = onlineAccess?.map((access) => {
    const copy = { ...access };

    if (copy.__typename === "InfomediaService") {
      copy.accessType = "infomedia";
    } else if (copy.issn) {
      // We combine physical and digital into single entry
      copy.accessType = orderPossible ? "combined" : "digitalCopy";
      // TODO: Hvad hedder denne nu?
      // } else if (copy.type === "webArchive") {
      //   copy.accessType = "webArchive";
    } else if (copy.url) {
      copy.accessType = "online";
    }

    return copy;
  });
  if (
    orderPossible &&
    !addi.find((access) => access.accessType === "combined")
  ) {
    addi.push({ accessType: "physical" });
  }

  return addi;
}

// quickfix dfi is not a 'real' url - @TODO do a proper fix
function specialSort(a, b) {
  // fjernleje should be on top
  if (b.url && b.url.indexOf("dfi.dk") !== -1) {
    return -1;
  } else if (a.url && a.url.indexOf("dfi.dk") !== -1) {
    return 1;
  }
  return 0;
}

export function Options({ modal, context }) {
  const { onlineAccess } = { ...context };

  // no type selected - get the first one
  const type = context.type;

  const addiOnlineAccess = addToOnlineAccess(
    onlineAccess,
    context.orderPossible
  );
  // quickfix - sort links from filmstriben - we want fjernleje on top
  const orderedOnlineAccess = sortorder(addiOnlineAccess).sort(specialSort);

  return (
    orderedOnlineAccess && (
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
  return <Options {...props} />;
}

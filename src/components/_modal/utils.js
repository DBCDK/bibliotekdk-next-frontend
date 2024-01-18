import * as orderMutations from "@/lib/api/order.mutations";
import Translate from "@/components/base/translate";
import Text from "@/components/base/text";
import { isFFUAgency } from "@/utils/agency";
import { buildHtmlLink } from "@/lib/utils";
// elements we want
const elements = [
  "a",
  "input:not([type='hidden'])",
  "button",
  "textarea",
  "[tabindex]",
];

// currently not in use
// eslint-disable-next-line no-unused-vars
export function tabVisibility(container, isVisible) {
  // build query with elements
  const query = elements.join(", ");

  // Find mathing elements according to elements and select string
  const matchedElements = Object.values(container.querySelectorAll(query));

  matchedElements.forEach((el) => {
    const tabIndex = el.getAttribute("tabindex") || false;
    const savedTabIndex = el.getAttribute("data-tabindex") || false;

    el.setAttribute(
      "tabindex",
      isVisible ? savedTabIndex || tabIndex || "0" : "-1"
    );

    if (!savedTabIndex) {
      el.setAttribute("data-tabindex", tabIndex);
    }
  });
}

/**
 * Function to get random color by random string
 *
 *  @param {string} id
 *  @param {Array} colors
 */
export function toColor(
  id,
  colors = ["#ffe7e0", "#e5c7bd", "#f4efdd", "#eed9b0", "#b7dee2"]
) {
  let hash = 0;
  if (id.length === 0) {
    return hash;
  }
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;
  return colors[hash];
}

/**
 * Function to get scrollY (scroll distance from top)
 *
 * @returns {number}
 */
function getScrollYPos() {
  // Get scrollY (all browsers)
  let doc = document.documentElement;
  return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
}

/**
 * Function to handle scrollLock on body
 *
 * @param {boolean} shouldLockScroll
 *
 */
let scrollY = 0;
export function scrollLock(shouldLockScroll) {
  const body = document.body;
  const layout = document.getElementById("layout");

  // We need booth
  if (!body || !layout) {
    return;
  }

  const isLocked = body.classList.contains("lockScroll");

  // Add "lock" class and add "fake" scrollY position to body
  if (shouldLockScroll && !isLocked) {
    scrollY = getScrollYPos();
    layout.style.marginTop = `-${scrollY}px`;
    body.classList.add("lockScroll");
  }
  // Remove "lock", remove "fake" scrollY position
  // + Scroll back to the scrollY position - same as before the modal was triggered
  else if (!shouldLockScroll && isLocked) {
    body.classList.remove("lockScroll");
    layout.style.marginTop = `auto`;
    window.scrollTo(0, scrollY);
  }
}

export function handleSubmitPeriodicaArticleOrder(
  pid,
  periodicaForm,
  loanerInfo,
  articleOrderMutation
) {
  articleOrderMutation.post(
    orderMutations.submitPeriodicaArticleOrder({
      pid,
      userName: loanerInfo?.userParameters?.userName,
      userMail: loanerInfo?.userParameters?.userMail,
      ...periodicaForm,
    })
  );
}

export function handleSubmitOrder(
  pids,
  pickupBranch,
  periodicaForm,
  pincode,
  loanerInfo,
  orderMutation
) {
  // merge pincode into userParameters
  let userParameters = loanerInfo.userParameters;
  if (pincode) {
    userParameters = { ...userParameters, pincode };
  }

  orderMutation.post(
    orderMutations.submitOrder({
      pids,
      branchId: pickupBranch.branchId,
      userParameters,
      ...periodicaForm,
    })
  );
}

export function highlightMarkedWords(
  highlight,
  regularText = "text3",
  semiboldText = "text4"
) {
  const regexed = highlight?.split(/(<mark>(?:.*?)<\/mark>)/g).map((el) => {
    if (el.startsWith("<mark>") && el.endsWith("</mark>")) {
      return (
        <Text
          key={JSON.stringify(el)}
          tag="span"
          type={semiboldText}
          style={{ fontWeight: 700 }}
        >
          {el.replace("<mark>", "").replace("</mark>", "")}
        </Text>
      );
    } else {
      return <>{el}</>;
    }
  });

  return (
    <Text tag="span" type={regularText}>
      {regexed}
    </Text>
  );
}

export function escapeColons(phrase) {
  return phrase.replace(":", "%3A");
}

/**
 * Select a branch and handle login
 * either the user is already logged in for that agency
 * or the user needs to log in for that agency, so prompt login or open loanerform
 * @param {Object} branch
 * @param {Object} modal
 * @param {Object} context
 * @param {function} updateLoanerInfo
 * @param {function|null} overrideOrderModalPush
 * @returns {void}
 */
export function handleOnSelect({
  branch,
  modal,
  context,
  updateLoanerInfo,
  overrideOrderModalPush = null,
}) {
  // Selected branch belongs to one of the user's agencies where the user is logged in
  const alreadyLoggedin = context.initial?.agencies?.find(
    (agency) => agency.result?.[0].agencyId === branch.agencyId
  );

  // New selected branch has borrowercheck
  const hasBorchk = branch.borrowerCheck;
  // if selected branch has same origin as user agency
  if (alreadyLoggedin && hasBorchk) {
    if (
      overrideOrderModalPush &&
      typeof overrideOrderModalPush === "function"
    ) {
      updateLoanerInfo({ pickupBranch: branch.branchId }).then(() =>
        overrideOrderModalPush()
      );
    } else {
      // Set new branch without new log-in
      updateLoanerInfo({ pickupBranch: branch.branchId });
      // update context at previous modal
      modal.prev();
    }

    return;
  }

  //  Show form if selected library doesn't support borchk
  if (!branch?.borrowerCheck) {
    modal.push("loanerform", {
      branchId: branch.branchId,
      changePickupBranch: true,
    });

    return;
  }

  let title;
  let text;

  //  FFU library selected
  if (isFFUAgency(branch)) {
    // if branch has a website url - include it as a variabel
    let link1 = Translate({ context: "general", label: "homepage" });
    if (branch.branchWebsiteUrl) {
      const txt = Translate({ context: "general", label: "homepage" });
      const url = branch.branchWebsiteUrl;
      link1 = buildHtmlLink(txt, url);
    }

    // Link to my libraries page
    const txt2 = Translate({ context: "profile", label: "myLibraries" });
    const url2 = "/profil/mine-biblioteker";
    const link2 = buildHtmlLink(txt2, url2);

    title = Translate({
      context: "login",
      label: "title-error-not-associated",
      vars: [branch.agencyName],
    });

    text = Translate({
      context: "login",
      label: "text-error-not-associated",
      vars: [branch.agencyName, link2, branch.agencyName, link1],
      renderAsHtml: true,
    });
  }

  // FOLK library selected
  else {
    // if branch has a website url - include it as a variabel
    let link1 = "";
    if (branch.branchWebsiteUrl) {
      const prefix = Translate({ context: "general", label: "link-for" });
      const txt = branch.agencyName;
      const url = branch.branchWebsiteUrl;
      link1 = `${prefix} ${buildHtmlLink(txt, url)}`;
    }

    title = Translate({
      context: "login",
      label: "title-error-not-registered",
      vars: [branch.agencyName],
    });

    text = Translate({
      context: "login",
      label: "text-error-not-registered",
      vars: [link1],
      renderAsHtml: true,
    });
  }

  modal.push("statusMessage", {
    title,
    text,
    agencyName: branch.agencyName,
    button: false,
  });
}

/**
 * avoid "Converting circular structure to JSON" error when stingifying stack
 * @param {Object} obj
 * @returns
 */
export function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

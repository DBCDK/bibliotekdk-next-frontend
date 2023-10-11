import * as orderMutations from "@/lib/api/order.mutations";
import Text from "@/components/base/text";

// elements we want
const elements = [
  "a",
  "input:not([type='hidden'])",
  "button",
  "textarea",
  "[tabindex]",
];

// currently not in use
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
 * Function to trap Tab inside modal
 *
 * @param {Object} event current target element (focused element)
 * @param {Object} container container to trap Tab in (modal)
 *
 * https://medium.com/@islam.sayed8/trap-focus-inside-a-modal-aa5230326c1b
 * https://medium.com/@seif_ghezala/how-to-create-an-accessible-react-modal-5b87e6a27503
 */

export function handleTab(event, container) {
  event.preventDefault();

  const el = container.querySelector("div.modal_page.page-current");

  // Custom select string to tail after each element in list
  // Dont select elements with display:none inline style
  // Dont select hidden elements
  // Dont select elements with tabindex -1
  const select =
    ":not([aria-hidden='true']):not([tabindex='-1']):not([style*='display:none']):not([style*='display: none']):not([disabled])";

  // build query with elements
  const query = elements.join(select + ", ") + select;

  // Find mathing elements according to elements and select string
  const matchedElements = Object.values(el.querySelectorAll(query));

  // Remove elements which parent is not visible
  const visibleChildren = matchedElements.filter(
    (el) => el.offsetParent !== null
  );

  // Remove all elements which is display:none in computedStyles (css stylesheet)
  // OBS! Performance Warning! getComputedStyle func can be slow
  const sequence = visibleChildren.filter(
    (el) => getComputedStyle(el).display !== "none"
  );

  // Debug -> remove me in future
  console.debug("Debug", { sequence });

  if (sequence.length < 1) {
    return;
  }

  const backward = event.shiftKey;
  const first = sequence[0];
  const last = sequence[sequence.length - 1];

  // wrap around first to last, last to first
  const source = backward ? first : last;
  const target = backward ? last : first;

  if (source === event.target) {
    target.focus();
    return;
  }

  // find current position in tabsequence
  let currentIndex;
  const found = sequence.some(function (element, index) {
    if (element !== event.target) {
      return false;
    }

    currentIndex = index;
    return true;
  });

  if (!found) {
    // redirect to first as we're not in our tabsequence
    first.focus();
    return;
  }

  // shift focus to previous/next element in the sequence
  const offset = backward ? -1 : 1;
  sequence[currentIndex + offset].focus();
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
  var doc = document.documentElement;
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
  loanerInfo,
  orderMutation
) {
  orderMutation.post(
    orderMutations.submitOrder({
      pids,
      branchId: pickupBranch.branchId,
      userParameters: loanerInfo.userParameters,
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
 * @param {string} callbackUID
 * @param {function|null} overrideOrderModalPush
 */
export function handleOnSelect(
  branch,
  modal,
  context,
  updateLoanerInfo,
  callbackUID = modal?.stack?.find((m) => m.id === "order")?.uid,
  overrideOrderModalPush = null
) {
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

  if (branch?.borrowerCheck) {
    modal.push("openAdgangsplatform", {
      agencyId: branch.agencyId,
      branchId: branch.branchId,
      agencyName: branch.agencyName,
      callbackUID: callbackUID, //we should always have callbackUID, but if we dont, order modal is not opened after login.
    });
    return;
  } else {
    modal.push("loanerform", {
      branchId: branch.branchId,
      changePickupBranch: true,
    });
  }
}

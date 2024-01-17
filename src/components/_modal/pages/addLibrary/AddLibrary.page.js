/**
 * @file - AddLiobrary.js
 * contains the ffu library selection to add FFu libraries to an folk account
 */

import PropTypes from "prop-types";
import { useState } from "react";

import Title from "@/components/base/title";
import Top from "@/components/_modal/pages/base/top";
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";
import { signIn } from "@dbcdk/login-nextjs/client";
import LibrarySearch from "./librarySearch/LibrarySearch";
import Translate from "@/components/base/translate/Translate";
import SearchResultList from "./searchResultList/SearchResultList";

import useVerification from "@/components/hooks/useVerification";
import useAccessToken from "@/components/hooks/user/useAccessToken";

import styles from "./AddLibrary.module.css";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

/**
 * Function to select a FFU library from a library list
 * Selecttin triggers a verification process uypdate and a new login flow
 *
 * @param {obj} data
 * @param {boolean} isVisible
 * @param {function} onChange
 * @param {boolean} isLoading
 * @param {Array} agencies
 * @param {func} updateVerification
 * @param {obj} modal
 * @param {obj} context
 * @param {string} context.title
 *
 * @returns {component}
 */
export function AddLibrary({
  data,
  isVisible,
  onChange,
  isLoading,
  modal,
  context,
  agencies,
  updateVerification,
}) {
  const allBranches = data?.result;
  const { title } = context;

  const onSelect = (branch) => {
    // error title and text, to be reassigned.
    let title;
    let text;

    //  if validation is possible (borrowercheck)
    if (!branch?.borrowerCheck) {
      title = "addLibraryNoBorchkTitle";
      text = "addLibraryNoBorchkText";
    }

    // selected library already syncs data to culr
    if (branch?.culrDataSync) {
      title = "addLibraryNoBorchkTitle";
      text = "addLibraryNoBorchkText";
    }

    // if user is not already created at the target branch
    if (agencies?.includes(branch?.agencyId)) {
      title = "addLibraryAlreadyCreatedTitle";
      text = "addLibraryAlreadyCreatedText";
    }

    if (title && text) {
      // if Agency doesn't support borchk - show error in modal
      modal.push("statusMessage", {
        title: Translate({
          context: "errorMessage",
          label: title,
          vars: [branch.agencyName],
        }),
        text: Translate({
          context: "errorMessage",
          label: text,
          vars: [branch.agencyName],
          renderAsHtml: true,
        }),
      });
    }

    // Allow addLibrary process
    else {
      //update session verfification process
      updateVerification();

      const adgangsplatformTitle = Translate({
        context: "addLibrary",
        label: "adgangsplatformTitle",
        vars: [branch.agencyName],
      });
      const adgangsplatformText = Translate({
        context: "addLibrary",
        label: "adgangsplatformText",
      });

      // add modalpage to store
      const UID = modal.saveToStore("verify", {
        title: Translate({
          context: "addLibrary",
          label: "hasVerificationTitle",
        }),
        text: Translate({
          context: "addLibrary",
          label: "hasVerificationText",
        }),
        back: false,
        agencyName: branch.agencyName,
      });

      // fire adgangsplatform modal
      modal.push("openAdgangsplatform", {
        title: adgangsplatformTitle,
        text: adgangsplatformText,
        agencyId: branch.agencyId,
        branchId: branch.branchId,
        agencyName: branch.agencyName,
        callbackUID: UID,
      });
    }
  };

  /**
   * If we close the login modal without loggin in,
   * we need to remove f. ex. order modal from store,
   * which we would have opened after login
   */
  function removeModalsFromStore() {
    modal.setStore([]);
  }

  return (
    <div className={styles.login}>
      <Top onClose={removeModalsFromStore} />
      <div>
        <Title type="title4" className={styles.title} tag="h2">
          {title}
        </Title>
      </div>

      <LibrarySearch onChange={onChange} />

      <SearchResultList
        allBranches={allBranches}
        isLoading={isLoading}
        onSelect={onSelect}
        isVisible={isVisible}
        includeArrows={true}
      />
    </div>
  );
}

AddLibrary.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.object,
  onChange: PropTypes.func,
};

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { originUrl = null } = props;

  const { loanerInfo } = useLoanerInfo();
  const accessToken = useAccessToken();
  const verification = useVerification();

  const agencies = loanerInfo?.agencies?.map(
    (agency) => agency?.result?.[0].agencyId
  );

  const agencyTypes = ["FORSKNINGSBIBLIOTEK"];

  const [query, setQuery] = useState("");
  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "", agencyTypes, limit: 20 })
  );

  const dummyData = {
    hitcount: 10,
    result: [
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a branch name" },
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a branch name" },
    ],
  };

  return (
    <AddLibrary
      {...props}
      isLoading={isLoading}
      data={isLoading ? dummyData : data?.branches}
      onChange={(q) => setQuery(q)}
      onLogin={signIn}
      origin={originUrl}
      agencies={agencies}
      updateVerification={() =>
        verification.update({
          accessToken,
          type: "FOLK",
        })
      }
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  skeleton: PropTypes.bool,
};

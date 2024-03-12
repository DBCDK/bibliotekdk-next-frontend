import { escapeColons } from "@/components/_modal/utils";
import { getLibraryType, LibraryTypeEnum } from "@/lib/utils";
import isEmpty from "lodash/isEmpty";
import { IconLink } from "@/components/base/iconlink/IconLink";
import styles from "./LinkForBranch.module.css";
import ExternalSvg from "@/public/icons/external_small.svg";
import animations from "@/components/base/animation/animations.module.css";
import Translate from "@/components/base/translate";
import uniq from "lodash/uniq";

/**
 * Builds the lookupUrl
 * @param {Object} library
 * @returns {*|boolean|string}
 */
function parseBranchLookupUrlForNonPublicLibrary(library) {
  const agencyHoldings = library?.holdingStatus?.agencyHoldings;
  const lookupUrl = library?.lookupUrl || null;
  const localIdentifiers = uniq(
    agencyHoldings?.map((agencyHolding) =>
      escapeColons(agencyHolding.localIdentifier)
    )
  ).join(" OR ");
  const itemLink =
    lookupUrl &&
    lookupUrl.indexOf("_IDNR_") !== -1 &&
    lookupUrl.replace("_IDNR_", localIdentifiers);

  if (!itemLink) {
    return lookupUrl + localIdentifiers;
  } else {
    return itemLink;
  }
}

/**
 * LinkForBranch returns the link for {@link BranchDetails} (and
 * @param library
 * @param pids
 * @param textType
 * @returns {JSX.Element}
 */
export function LinkForBranch({ library, pids, textType = "text2" }) {
  const cqlPids = pids?.map((pid) => escapeColons(pid)).join(" OR ");

  const publicLibraryWithWebsiteAndSearch =
    getLibraryType(library?.agencyId) ===
      LibraryTypeEnum.DANISH_PUBLIC_LIBRARY &&
    library?.lookupUrl &&
    library?.branchWebsiteUrl &&
    !isEmpty(cqlPids) &&
    `${library?.branchWebsiteUrl}/search/ting/${cqlPids}`;

  const nonPublicLibraryWithWebsiteAndSearch =
    !(
      getLibraryType(library?.agencyId) ===
      LibraryTypeEnum.DANISH_PUBLIC_LIBRARY
    ) &&
    library?.lookupUrl &&
    !isEmpty(library?.holdingStatus?.agencyHoldings) &&
    parseBranchLookupUrlForNonPublicLibrary(library);

  const website = library?.branchWebsiteUrl || library?.branchCatalogueUrl;

  return publicLibraryWithWebsiteAndSearch ||
    nonPublicLibraryWithWebsiteAndSearch ||
    website ? (
    <IconLink
      className={styles.path_blue}
      iconPlacement="right"
      iconSrc={ExternalSvg}
      iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
      textType={textType}
      href={
        publicLibraryWithWebsiteAndSearch ||
        nonPublicLibraryWithWebsiteAndSearch ||
        website
      }
      target="_blank"
    >
      {Translate({
        context: "localizations",
        label: "see_detailed_status",
        vars: [library?.agencyName],
        renderAsHtml: false,
      })}
    </IconLink>
  ) : (
    <div></div>
  );
}

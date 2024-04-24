import { IconLink } from "@/components/base/iconlink/IconLink";
import styles from "./LinkForBranch.module.css";
import ExternalSvg from "@/public/icons/external_small.svg";
import animations from "@/components/base/animation/animations.module.css";
import Translate from "@/components/base/translate";

/**
 * LinkForBranch returns the link for {@link BranchDetails} (and
 * @param library
 * @param pids
 * @param textType
 * @returns {JSX.Element}
 */
export function LinkForBranch({ library, textType = "text2" }) {
  const lookupUrl = library?.holdings?.lookupUrl;

  return lookupUrl ? (
    <IconLink
      className={styles.path_blue}
      iconPlacement="right"
      iconSrc={ExternalSvg}
      iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
      textType={textType}
      href={lookupUrl}
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

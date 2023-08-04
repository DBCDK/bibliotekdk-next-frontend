import Top from "@/components/_modal/pages/base/top";
import styles from "./BranchLocalizations.module.css";
import cx from "classnames";
import LocalizationsBase from "@/components/_modal/pages/base/localizationsBase/LocalizationsBase";
import BranchLocalizationItem from "./branchLocalizationItem/BranchLocalizationItem";

export default function BranchLocalizations({ context, modal }) {
  const { libraries } = context;

  return (
    <LocalizationsBase modal={modal} context={context} libraries={libraries}>
      <LocalizationsBase.List>
        {libraries?.holdingStatus?.map((branch) => (
          <li key={JSON.stringify(branch)}>
            <BranchLocalizationItem
              context={context}
              branch={branch}
              modal={modal}
            />
          </li>
        ))}
      </LocalizationsBase.List>
    </LocalizationsBase>
  );
}

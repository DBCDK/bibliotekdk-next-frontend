import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import LibrariesTable from "../librariesTable/LibrariesTable";
import styles from "./myLibrariesPage.module.css";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton/IconButton";

import { useState } from "react";
import AddLibraryButton from "./addLibraryButton/AddLibraryButton";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

/**
 * Shows the users libraries and makes it possible to add a new library
 *
 * @returns {React.JSX.Element}
 *
 */

export default function MyLibrariesPage() {
  const authUser = useLoanerInfo();
  const [showMore, setShowMore] = useState(false);

  //An array of user agencies.
  const agencies = authUser?.loanerInfo?.agencies
    ?.map((agency) => ({
      agencyId: agency?.result[0]?.agencyId,
      agencyName: agency?.result[0]?.agencyName,
      agencyType: agency?.result[0]?.agencyType,
    }))
    .filter((agency) => !!agency.agencyName && !!agency.agencyId);

  return (
    <Layout title={Translate({ context: "profile", label: "myLibraries" })}>
      <div className={styles.pageDescriptionContainer}>
        <Text className={styles.pageDescription}>
          {Translate({ context: "profile", label: "myLibrariesInfo" })}
        </Text>
        {showMore && (
          <Text className={styles.showMoreText}>
            {Translate({ context: "profile", label: "myLibrariesMoreInfo" })}
          </Text>
        )}
        <IconButton
          icon={showMore ? "arrowUp" : "arrowDown"}
          onClick={() => setShowMore(!showMore)}
          keepUnderline={true}
        >
          {Translate({
            context: "profile",
            label: showMore ? "showLess" : "showMore",
          })}
        </IconButton>
      </div>

      <LibrariesTable data={agencies} user={authUser} />

      {!agencies?.length && (
        <div className={styles.emptyAgencyList}>
          <Text type="text2">
            {Translate({ context: "profile", label: "noLibrariesMessage" })}
          </Text>
        </div>
      )}

      <AddLibraryButton />
    </Layout>
  );
}

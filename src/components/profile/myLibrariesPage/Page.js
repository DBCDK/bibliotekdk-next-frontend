import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import LibrariesTable from "../librariesTable/LibrariesTable";
import styles from "./myLibrariesPage.module.css";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import useUser from "@/components/hooks/useUser";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton/IconButton";
import { useState } from "react";

/**
 * Shows the users libraries and makes it possible to add a new library
 *
 * @returns {component}
 *
 */

export default function MyLibrariesPage() {
  const { isAuthenticated } = useUser();
  const [showMore, setShowMore] = useState(false);
  const { data: userData } = useData(
    isAuthenticated && userFragments.branchesForUser()
  );

  const result = userData?.user?.agency?.result;

  //Find a list of user agencies
  const agencies = [];
  const addedAgencyIds = [];

  result?.forEach((branch) => {
    if (!addedAgencyIds.includes(branch.agencyId)) {
      addedAgencyIds.push(branch.agencyId);
      agencies.push({
        agencyId: branch.agencyId,
        agencyName: branch.agencyName,
      });
    }
  });

  return (
    <Layout title={Translate({ context: "profile", label: "myLibraries" })}>
      <div className={styles.pageDescriptionContainer}>
        <Text className={styles.pageDescription}>
          {Translate({ context: "profile", label: "myLibrariesInfo" })}
        </Text>

        <IconButton
          className={styles.showMoreBtn}
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

      {showMore && (
        <Text className={styles.showMoreText}>
          {Translate({ context: "profile", label: "myLibrariesMoreInfo" })}
        </Text>
      )}
      <LibrariesTable data={agencies} />
      <IconButton icon="chevron" className={styles.addLibrary} textType="text2">
        {Translate({ context: "profile", label: "addLibrary" })}
      </IconButton>
    </Layout>
  );
}

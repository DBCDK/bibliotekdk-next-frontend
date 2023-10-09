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
 * @returns {React.ReactElement | null}
 *
 */

export default function MyLibrariesPage() {
  const { isAuthenticated } = useUser();
  const [showMore, setShowMore] = useState(false);
  const { data: userData } = useData(
    isAuthenticated && userFragments.branchesForUser()
  );

  //An array of user agencies.
  const agencies = userData?.user?.agencies
    ?.map((agency) => ({
      agencyId: agency?.result[0]?.agencyId,
      agencyName: agency?.result[0]?.agencyName,
    }))
    .filter((agency) => !!agency.agencyName && !!agency.agencyId);

  const municipalityAgencyId = userData?.user?.municipalityAgencyId;
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

      <LibrariesTable
        data={agencies}
        municipalityAgencyId={municipalityAgencyId}
      />
      <IconButton icon="chevron" className={styles.addLibrary} textType="text2">
        {Translate({ context: "profile", label: "addLibrary" })}
      </IconButton>
    </Layout>
  );
}

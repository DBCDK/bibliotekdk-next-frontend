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

  return (
    <Layout title={Translate({ context: "profile", label: "myLibraries" })}>
      <div className={styles.pageDescription}>
        <Text>
          {Translate({ context: "profile", label: "myLibrariesInfo" })}
        </Text>
        <IconButton
          icon={showMore ? "arrowUp" : "arrowDown"}
          onClick={() => setShowMore(!showMore)}
        >{`Vis ${showMore ? "mindre" : "mere"}`}</IconButton>
      </div>

      {showMore && (
        <Text>
          {Translate({ context: "profile", label: "myLibrariesMoreInfo" })}
        </Text>
      )}
      <LibrariesTable data={result} />
      <IconButton icon="chevron" className={styles.addLibrary} textType="text2">
        {Translate({ context: "profile", label: "addLibrary" })}
      </IconButton>
    </Layout>
  );
}

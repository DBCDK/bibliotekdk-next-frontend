/* eslint-disable */

import { useModal } from "@/components/_modal";
import Layout from "../profileLayout";
import styles from "./indstillinger.module.css";

import Top from "@/components/_modal/pages/base/top";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Link from "@/components/base/link";
import useUser from "@/components/hooks/useUser";

const itemsPerPage = 4;

/**
 * Shows the previous orders made by the user from bibliotekdk.
 *
 * @returns {component}
 *
 */

export default function SettingsPage() {
  let modal = useModal();
  const { isAuthenticated, loanerInfo } = useUser();

  const userName = loanerInfo?.userParameters?.userName;

  return (
    <Layout title={"Indstillinger"}>
      <div className={styles.modalContainer}>
        <div className={styles.userInfo}>
          <div className={styles.dataItem}>
            <Text type="text4">Bopælskommune:</Text>
            <Text>Københavns Kommune</Text>
          </div>
          <div className={styles.dataItem}>
            <Text type="text4">Favorit afhentningssted:</Text>
            {/* <Text>Stadsbiblioteket, Lyngby</Text> */}
            <Link
              onClick={() => {
                alert(
                  "Vis dropdown eller modal hvor man kan ændre fav afhentingssted"
                );
              }}
              className={styles.deleteProfileButton}
              border={{
                top: false,
                bottom: {
                  keepVisible: true,
                },
              }}
            >
              Stadsbiblioteket, Lyngby
            </Link>
          </div>
          {/* <div className={styles.dataItem}>
          <Text type="text4">Mail:</Text>
          <Text>Alfred@hej.dk</Text>
        </div> */}
        </div>

        <Link
          onClick={() => {
            modal.push("deleteProfile");
          }}
          className={`${styles.deleteProfileButton} ${styles.deleteProfileButtonCustom}`}
          border={{
            top: false,
            bottom: {
              keepVisible: true,
            },
          }}
        >
          Slet profil
        </Link>
      </div>
    </Layout>
  );
}

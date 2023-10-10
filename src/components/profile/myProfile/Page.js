import { useModal } from "@/components/_modal";
import Layout from "../profileLayout";
import styles from "./MyProfile.module.css";

import Text from "@/components/base/text";

import useUser from "@/components/hooks/useUser";
import Translate from "@/components/base/translate/Translate";
import Title from "@/components/base/title";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import IconButton from "@/components/base/iconButton/IconButton";

/**
 * Shows the previous orders made by the user from bibliotekdk.
 *
 * @returns {component}
 *
 */

export default function SettingsPage() {
  let modal = useModal();
  const { isAuthenticated, loanerInfo } = useUser();
  const { data: userData } = useData(
    isAuthenticated && userFragments.extendedData()
  );
  const userName = loanerInfo?.userParameters?.userName;
  const { agencies, municipalityAgencyId } = loanerInfo;
  const municipalityAgency = agencies
    ?.map((agency) => agency?.result[0])
    .find((agency) => agency?.agencyId == municipalityAgencyId);

  const createdAt = userData?.user?.createdAt;
  const { day, monthName, year } = parseDate(createdAt);
  return (
    <Layout title={Translate({ context: "profile", label: "myProfile" })}>
      <div className={styles.modalContainer}>
        <div className={styles.userInfo}>
          <div className={styles.dataItem}>
            <Title className={styles.dataItemTitle} type="title6">
              {Translate({ context: "general", label: "name" })}
            </Title>
            <Text type="text2">{userName}</Text>
          </div>
          {municipalityAgency?.agencyName && (
            <div className={styles.dataItem}>
              <Title className={styles.dataItemTitle} type="title6">
                {Translate({
                  context: "profile",
                  label: "municipalityOfResidence",
                })}
              </Title>
              <Text>{municipalityAgency?.agencyName}</Text>
            </div>
          )}
          <div className={styles.dataItem}>
            <Title className={styles.dataItemTitle} type="title6">
              {Translate({ context: "profile", label: "profileCreated" })}
            </Title>
            <Text>{`${day}. ${monthName} ${year}`}</Text>
          </div>
        </div>

        <IconButton
          icon="chevron"
          keepUnderline
          onClick={() => {
            modal.push("deleteProfile");
          }}
          className={` ${styles.deleteProfileButtonCustom}`}
          border={{
            top: false,
            bottom: {
              keepVisible: true,
            },
          }}
        >
          <Text type="text2">
            {Translate({ context: "profile", label: "deleteProfile" })}
          </Text>
        </IconButton>
      </div>
    </Layout>
  );
}

/**
 * Parses an iso-8601 date string into human readable date an time strings.
 * @param {*} isoDateString
 * @returns an object containing date and time fields. Eks {date: "D. 24. juni", time:"Kl. 11:07"}
 */
const parseDate = (isoDateString) => {
  const dateObj = new Date(isoDateString);
  const day = dateObj.getUTCDate();
  const monthNames = [
    "jan.",
    "feb.",
    "mar.",
    "apr.",
    "maj",
    "jun.",
    "jul.",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "dec.",
  ];
  const monthName = monthNames[dateObj.getUTCMonth()];
  const date = `D. ${day} ${monthName}`;

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const time = `Kl. ${hours}.${minutes}`;
  const year = dateObj.getFullYear();
  //check if the date is today:
  const today = new Date();

  const isToday =
    dateObj.getUTCDate() === today.getUTCDate() &&
    dateObj.getUTCMonth() === today.getUTCMonth() &&
    dateObj.getUTCFullYear() === today.getUTCFullYear();

  return { day, monthName, year, date, time, isToday };
};

import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import LibrariesTable from "../librariesTable/LibrariesTable";
import styles from "./orderHistoryPage.module.css";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import useUser from "@/components/hooks/useUser";
import Text from "@/components/base/text";
import IconButton from "@/components/base/iconButton/IconButton";
import { useState } from "react";
import Link from "@/components/base/link";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import Title from "@/components/base/title";
import { getWorkUrl } from "@/lib/utils";
import MaterialRow, { MaterialHeaderRow } from "../materialRow/MaterialRow";

/**
 * Shows the orders made by the user from bibliotekdk.
 *
 * @returns {component}
 *
 */

export default function MyLibrariesPage() {
  return (
    <Layout title={Translate({ context: "profile", label: "orderHistory" })}>
      <Text className={styles.orderHistoryInfo}>
        {Translate({ context: "profile", label: "orderHistoryInfo" })}
      </Text>

      <Link
        href="/"
        border={{
          top: false,
          bottom: {
            keepVisible: true,
          },
        }}
      >
        <Text type="text3" tag="span">
          {Translate({ context: "profile", label: "canWeSaveYourOrders" })}
        </Text>
      </Link>

      <div className={styles.headerRow}>
        <Text className={styles.headerItem}>Dato </Text>
        <Text className={styles.headerItem}>Aktivitet </Text>
        <Text className={styles.headerItem}>Bestillingsnummer </Text>
      </div>
      {mockedOverview.map((order) => {
        return <TableItem order={order} />;
      })}
    </Layout>
  );
}
/**
 * Tablerow to be used in LibrariesTable component.
 * @param {obj} props
 * @returns {component}
 */
function TableItem({ order }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const { author, title, pid, orderId, creationDate } = order;
  const { date, time } = parseDate(creationDate);
  return (
    <div className={styles.tableItem}>
      <div>
        <Text type="text3"> {date}</Text>
        <Text type="text3"> {time}</Text>
      </div>
      <div>
        <Text type="text1"> Bestilling registreret</Text>
        <Text type="text2" className={styles.subHeading}>
          {"Du har bestilt "}
          <Link
            href={getWorkUrl(
              title,
              [{ nameSort: author || "", display: author || "" }],
              "work-of:" + pid
            )}
            border={{
              top: false,
              bottom: {
                keepVisible: true,
              },
            }}
          >
            {title}
          </Link>
          {author && ` af ${author}`}
        </Text>
      </div>

      <Text type="text3"> {orderId}</Text>
    </div>
  );
}

const parseDate = (isoDateString) => {
  // ISO 8601 date-time string
  //const isoDateString = "2023-08-08T13:41:59.000+00:00";

  // Convert it to a Date object
  const dateObj = new Date(isoDateString);

  // Custom format the date part
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
  const monthName = monthNames[dateObj.getUTCMonth()]; // month is 0-indexed
  const date = `D. ${day} ${monthName}`;

  // Custom format the time part
  const hours = String(dateObj.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const time = `Kl. ${hours}.${minutes}`;
  console.log(date); // "D. 8 aug."
  console.log(time); // "Kl. 13.41"
  return { date, time };
};
const mockedOverview = [
  {
    orderId: "1046602794",
    creationDate: "2023-09-13T11:01:42.000+00:00",
    author: "Rathje, Jonas Kuld",
    title: "Teorien om alt",
    closed: false,
    pid: "870970-basis:47210577",
  },
  {
    autoForwardResult: null,
    placeOnHold: "yes",
    orderId: "1046912235",
    pickupAgencyId: "748000",
    pid: "870970-basis:134559373",
    closed: false,
    creationDate: "2023-07-28T08:14:40.072+00:00",
    author: null,
    title: "Alt om Bluey",
  },
  {
    autoForwardResult: "automated",
    placeOnHold: "yes",
    orderId: "1047031461",
    pickupAgencyId: "710100",
    pid: "800010-katalog:99122372377605763",
    closed: false,
    creationDate: "2023-08-11T11:10:46.000+00:00",
    author: "Jensen, Jette, f. 1943",
    title: "Ungdomsturister i København 1971",
  },
];

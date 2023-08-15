import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import styles from "./orderHistoryPage.module.css";
import { useData } from "@/lib/api/api";
import { orderHistory, orderStatus } from "@/lib/api/user.fragments";
import useUser from "@/components/hooks/useUser";
import Text from "@/components/base/text";

import Link from "@/components/base/link";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { getWorkUrl } from "@/lib/utils";
import { useModal } from "@/components/_modal";

/**
 * Shows the orders made by the user from bibliotekdk.
 *
 * @returns {component}
 *
 */

export default function OrderHistoryPage() {
  const { isAuthenticated } = useUser();

  const { data, isLoading } = useData(isAuthenticated && orderHistory());
  const bibliotekDkOrders = data?.user?.bibliotekDkOrders?.map(
    (order) => order.orderId
  );

  const orderData = useData(
    bibliotekDkOrders?.length > 0 &&
      orderStatus({ orderIds: bibliotekDkOrders })
  );
  console.log("bibliotekDkOrders", bibliotekDkOrders);
  console.log("orderData", orderData);
  const orders = orderData?.data?.orderStatus;
  console.log("1orders", orders);

  const modal = useModal();

  return (
    <Layout title={Translate({ context: "profile", label: "orderHistory" })}>
      <Text className={styles.orderHistoryInfo}>
        {Translate({ context: "profile", label: "orderHistoryInfo" })}
      </Text>

      <Link
        onClick={() => {
          modal.push("orderHistoryDataConsent");
        }}
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
      {orders?.map((order) => {
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
  const isMobile = breakpoint === "xs";

  const { author, title, pid, orderId, creationDate } = order;
  const { date, time } = parseDate(creationDate);
  return (
    <div className={styles.tableItem}>
      {!isMobile && (
        <div>
          <Text type="text3"> {date}</Text>
          <Text type="text3"> {time}</Text>
        </div>
      )}
      <div>
        <Text type="text1">
          {Translate({ context: "profile", label: "orderRegistered" })}
        </Text>
        {isMobile && (
          <Text className={styles.mobileDate} type="text3">
            {date}
          </Text>
        )}
        <Text type="text2" className={styles.orderWorkInfo}>
          {Translate({ context: "profile", label: "youHaveOrdered" }) + " "}
          <Link
            href={getWorkUrl(
              title,
              [],
              //   [{ nameSort: author || "", display: author || "" }],
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
          {author &&
            ` ${Translate({ context: "general", label: "by" })} ${author}`}
        </Text>
      </div>
      <div className={styles.orderNumber}>
        {breakpoint === "xs" && (
          <Text className={styles.orderNumberText} type="text4">
            {Translate({ context: "profile", label: "orderNumber" })}
          </Text>
        )}
        <Text type="text3">{orderId} </Text>
      </div>
    </div>
  );
}

/**
 * Parses an iso 8601 date string into human readable date an time strings.
 * @param {*} isoDateString
 * @returns an object containing date and time fields. Eks {date: "D. 24. juni", time:"Kl. 11:07"}
 */
const parseDate = (isoDateString) => {
  const dateObj = new Date(isoDateString);
  console.log("isoDateString", isoDateString);
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

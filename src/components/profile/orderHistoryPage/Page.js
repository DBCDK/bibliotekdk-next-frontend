import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import styles from "./OrderHistoryPage.module.css";
import { useData } from "@/lib/api/api";
import useUser from "@/components/hooks/useUser";
import Text from "@/components/base/text";
import Pagination from "@/components/search/pagination/Pagination";

import Link from "@/components/base/link";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { getWorkUrl } from "@/lib/utils";
import { useModal } from "@/components/_modal";
import { orderHistory } from "@/lib/api/order.fragments";
import { useEffect, useState } from "react";
const itemsPerPage = 4;

/**
 * Shows the previous orders made by the user from bibliotekdk.
 *
 * @returns {component}
 *
 */

export default function OrderHistoryPage() {
  const { isAuthenticated } = useUser();
  //const breakpoint = useBreakpoint();
  const modal = useModal();

  //  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const [totalPages, setTotalPages] = useState(0); //todo change to null
  const [currentPage, setCurrentPage] = useState(1); //todo change to null
  const [orderHistoryData, setOrderHistoryData] = useState([]);

  const { data: userData, error } = useData(
    isAuthenticated &&
      orderHistory({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      })
  );
  console.log("userData", userData);
  console.log("error", error);
  console.log("currentPage", currentPage);
  console.log("  currentPage* itemsPerPage  ", currentPage * itemsPerPage);
  console.log("totalPages", totalPages);
  console.log("itemsPerPage", itemsPerPage);

  useEffect(() => {
    if (userData) {
      const fetchedData = userData?.user?.bibliotekDkOrders?.result;
      const pages = Math.ceil(
        userData?.user?.bibliotekDkOrders?.hitcount / itemsPerPage
      );
      setTotalPages(pages);
      setOrderHistoryData(fetchedData);
    }
  }, [userData]);

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
        <Text className={styles.headerItem}>
          {Translate({ context: "profile", label: "date" })}
        </Text>
        <Text className={styles.headerItem}>
          {Translate({ context: "profile", label: "activity" })}
        </Text>
        <Text className={styles.headerItem}>
          {Translate({ context: "profile", label: "orderNumber" })}
        </Text>
      </div>

      {orderHistoryData?.map((order) => {
        return <TableItem order={order} key={order?.orderId} />;
      })}
      <Pagination
        className={styles.pagination}
        numPages={totalPages}
        currentPage={currentPage}
        onChange={setCurrentPage}
      />
    </Layout>
  );
}
/**
 * @param {obj} props
 * @returns {component}
 */
function TableItem({ order, key }) {
  const breakpoint = useBreakpoint();

  if (!order) {
    return null;
  }
  const isMobile = breakpoint === "xs";
  const { author, title, pidOfPrimaryObject, orderId, creationDate } = order;
  const { date, time } = parseDate(creationDate);
  return (
    <div className={styles.tableItem} key={key}>
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
              [{ nameSort: author || "", display: author || "" }],
              "work-of:" + pidOfPrimaryObject
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
            {`${Translate({ context: "profile", label: "orderNumber" })}:`}
          </Text>
        )}
        <Text type="text3">{orderId} </Text>
      </div>
    </div>
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

  const hours = String(dateObj.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const time = `Kl. ${hours}.${minutes}`;

  return { date, time };
};

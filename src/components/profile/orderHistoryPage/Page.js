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
import { useRouter } from "next/router";
const itemsPerPage = 4;

/**
 * Shows the previous orders made by the user from bibliotekdk.
 *
 * @returns {component}
 *
 */

export default function OrderHistoryPage() {
  const { isAuthenticated } = useUser();
  const breakpoint = useBreakpoint();
  const modal = useModal();
  const router = useRouter();
  const { page } = router.query;
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const [totalPages, setTotalPages] = useState(0);
  //check if url parameter "page" is a valid number. If so set it as current page otherwise set page to default value 1
  const parsedPage = parseInt(page, 10);
  const isValidPage = !isNaN(parsedPage) && parsedPage > 0;
  const [currentPage, setCurrentPage] = useState(isValidPage ? parsedPage : 1);
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  //fetch paginated orderhistorydaya
  const { data, isLoading } = useData(
    isAuthenticated &&
      orderHistory({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      })
  );

  /**
   * Updates url query params with page
   */
  async function updateQueryParams(params) {
    const query = { ...router.query, ...params };
    await router.push(
      { pathname: router.pathname, query },
      {
        pathname: router.asPath.replace(/\?.*/, ""),
        query,
      },
      { shallow: true, scroll: false }
    );
  }
  const onPageChange = async (newPage) => {
    if (newPage > totalPages) {
      newPage = totalPages;
    }
    await updateQueryParams({ page: newPage });
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (data) {
      const fetchedData = data?.user?.bibliotekDkOrders?.result;
      const pages = Math.ceil(
        data?.user?.bibliotekDkOrders?.hitcount / itemsPerPage
      );
      setTotalPages(pages);
      if (fetchedData) {
        //om mobile, merge the previous data with the new fetched data. On desktop show only one page at a time
        setOrderHistoryData((prevData) =>
          isMobile ? [...prevData, ...fetchedData] : fetchedData
        );
      }
    }
  }, [data, isLoading]);

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

      <table>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerItem}>
              {Translate({ context: "profile", label: "date" })}
            </th>
            <th className={styles.headerItem}>
              {Translate({ context: "profile", label: "activity" })}
            </th>
            <th className={styles.headerItem}>
              {Translate({ context: "profile", label: "orderNumber" })}
            </th>
          </tr>
        </thead>
        <tbody>
          {orderHistoryData?.map((order) => (
            <TableItem order={order} key={order?.orderId} />
          ))}
        </tbody>
      </table>
      <Pagination
        className={styles.pagination}
        numPages={totalPages}
        currentPage={parseInt(page, 10)}
        onChange={onPageChange}
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
    <tr className={styles.tableItem}>
      <td className={styles.date}>
        {!isMobile && (
          <>
            <Text type="text3">{date}</Text>
            <Text type="text3">{time}</Text>
          </>
        )}

      </td>
      <td className={styles.activity}>
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
      </td>
      <td className={styles.orderNumber}>
        {breakpoint === "xs" && (
          <Text className={styles.orderNumberText} type="text4">
            {`${Translate({ context: "profile", label: "orderNumber" })}:`}
          </Text>
        )}
        <Text type="text3">{orderId}</Text>
      </td>
    </tr>
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

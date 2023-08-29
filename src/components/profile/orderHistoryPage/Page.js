import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import styles from "./orderHistoryPage.module.css";
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
  //fetch paginated orderhistorydata
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
        //on mobile, merge the previous data with the new fetched data. On desktop show only one page at a time
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

      {isMobile ? (
        <>
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
        </>
      ) : (
        <table className={styles.orderHistoryTable}>
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
      )}
      <Pagination
        className={styles.pagination}
        numPages={totalPages}
        currentPage={parseInt(currentPage, 10)}
        onChange={onPageChange}
      />
    </Layout>
  );
}

/**
 * TableItem shows info for a single order.
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
  const { date, time, isToday } = parseDate(creationDate);
  const dateString = isToday
    ? Translate({ context: "profile", label: "last-day" })
    : date;

  if (isMobile) {
    return (
      <div className={styles.tableItem} key={key}>
        <div>
          <Text type="text1">
            {Translate({ context: "profile", label: "orderRegistered" })}
          </Text>
          <Text className={styles.mobileDate} type="text3">
            {dateString}
          </Text>
          <WorkInfo
            title={title}
            author={author}
            pidOfPrimaryObject={pidOfPrimaryObject}
            date={dateString}
          />
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
  return (
    <tr className={styles.tableItem} key={key}>
      <td className={styles.date}>
        {!isMobile && (
          <>
            <Text type="text3">{dateString}</Text>
            <Text type="text3">{time}</Text>
          </>
        )}
      </td>
      <td className={styles.activity}>
        <WorkInfo
          title={title}
          author={author}
          pidOfPrimaryObject={pidOfPrimaryObject}
          date={dateString}
        />
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
 * Used in TableItem. Shows info (like title, author, link to work) for a given order
 * @returns
 */
function WorkInfo({ title, author, pidOfPrimaryObject }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";

  return (
    <>
      {!isMobile && (
        <Text type="text1">
          {Translate({ context: "profile", label: "orderRegistered" })}
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
    </>
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
  //check if the date is today:
  const today = new Date();

  const isToday =
    dateObj.getUTCDate() === today.getUTCDate() &&
    dateObj.getUTCMonth() === today.getUTCMonth() &&
    dateObj.getUTCFullYear() === today.getUTCFullYear();

  return { date, time, isToday };
};

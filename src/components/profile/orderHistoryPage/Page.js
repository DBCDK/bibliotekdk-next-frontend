import Translate from "@/components/base/translate/Translate";
import Layout from "../profileLayout";
import styles from "./orderHistoryPage.module.css";
import { useData } from "@/lib/api/api";
import useUser from "@/components/hooks/useUser";
import Text from "@/components/base/text";
import Pagination from "@/components/search/pagination/Pagination";

import Link from "@/components/base/link";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { useModal } from "@/components/_modal";
import { orderHistory } from "@/lib/api/order.fragments";
import { useEffect, useState } from "react";
import * as userFragments from "@/lib/api/user.fragments";
import Skeleton from "@/components/base/skeleton/Skeleton";
import { getWorkUrlForProfile } from "@/components/profile/utils";
import { parseDate } from "@/lib/utils";
import useAuthentication from "@/components/hooks/user/useAuthentication";

const itemsPerPage = 4;

/**
 * Shows the previous orders made by the user from bibliotekdk.
 *
 * @returns {React.JSX.Element}
 *
 */

export default function OrderHistoryPage() {
  const { hasCulrUniqueId } = useAuthentication();
  const breakpoint = useBreakpoint();
  const modal = useModal();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  //fetch paginated orderhistorydata
  const { data, isLoading } = useData(
    hasCulrUniqueId &&
      orderHistory({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      })
  );
  const { data: userData, mutate } = useData(
    hasCulrUniqueId && userFragments.extendedData()
  );
  const persistUserData = !!userData?.user?.persistUserData;

  const onPageChange = async (newPage) => {
    if (newPage > totalPages) {
      newPage = totalPages;
    }
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

  useEffect(() => {
    if (!modal.isVisible) {
      //hacked solution. Calling mutate() directley does not refetch user consent data.
      setTimeout(mutate, 200);
    }
  }, [modal.isVisible]);

  if (isLoading) {
    return (
      <Layout title={Translate({ context: "profile", label: "orderHistory" })}>
        <Skeleton lines={2} className={styles.skeletonText} />
        <div className={styles.skeletonContainer}>
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
        </div>
      </Layout>
    );
  }
  return (
    <Layout title={Translate({ context: "profile", label: "orderHistory" })}>
      {persistUserData ? (
        <Text type="text3">
          {Translate({ context: "profile", label: "consentInfoTextpart1" })}
          <Link
            className={styles.consentLink}
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
            {Translate({ context: "profile", label: "consent" })}
          </Link>
          {Translate({ context: "profile", label: "consentInfoTextpart2" })}
        </Text>
      ) : (
        <>
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
        </>
      )}

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

          {totalPages == 0 ? (
            <Text className={styles.emptyListText}>
              {Translate({ context: "profile", label: "emptyOrderList" })}
            </Text>
          ) : (
            orderHistoryData?.map((order) => {
              return <TableItem order={order} key={order?.orderId} />;
            })
          )}
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
          {totalPages == 0 ? (
            <Text className={styles.emptyListText}>
              {Translate({ context: "profile", label: "emptyOrderList" })}
            </Text>
          ) : (
            <tbody>
              {orderHistoryData?.map((order) => (
                <TableItem order={order} key={order?.orderId} />
              ))}
            </tbody>
          )}
        </table>
      )}
      {totalPages > 1 && (
        <Pagination
          className={styles.pagination}
          numPages={totalPages}
          currentPage={parseInt(currentPage, 10)}
          onChange={onPageChange}
        />
      )}
    </Layout>
  );
}

/**
 * TableItem shows info for a single order.
 * @param {Object} props
 * @returns {React.JSX.Element}
 */
function TableItem({ order, key }) {
  const breakpoint = useBreakpoint();

  if (!order) {
    return null;
  }
  const isMobile = breakpoint === "xs";
  const { author, title, pidOfPrimaryObject, orderId, creationDate } = order;
  const { day, monthName, isToday, hours, minutes } = parseDate(creationDate);

  const time = `Kl. ${hours}.${minutes}`;
  const dateString = isToday
    ? Translate({ context: "profile", label: "last-day" })
    : `D. ${day}. ${monthName}`;

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
          //pidOfPrimaryObject is the primary bibliographic object id (work id).
          href={getWorkUrlForProfile({ workId: pidOfPrimaryObject })}
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

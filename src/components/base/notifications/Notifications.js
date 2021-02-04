import PropTypes from "prop-types";

import Text from "@/components/base/text/Text";
import React, { useState } from "react";
import { useData } from "@/lib/api/api";
import { notificationsQuery } from "@/lib/api/notification.fragment";
import styles from "./Notifications.module.css";
import classNames from "classnames/bind";
import Button from "@/components/base/button/Button";

/**
 * list of notifications
 * @param notificationArray
 * @param hideNotification
 * @return {unknown[]}
 * @constructor
 */
export function Notifications({ notificationObject }) {
  // check and make it an array
  const notificationArray = notificationsFilter(notificationObject);

  const [showNotification, setShowNotification] = useState(true);
  const toggleNotification = () => {
    sessionStorage.setItem("showme", "no");
    setShowNotification(!showNotification);
  };

  return notificationArray.map((notification, index) => (
    <div
      key={`${notification.fieldNotificationText}_${index}`}
      className={classNames(
        styles[`${notification.fieldNotificationType}`],
        styles.notification,
        sessionStorage.getItem("showme") === "no" ? styles.hidden : ""
      )}
    >
      <Text type="text2">{`${notification.fieldNotificationText}`}</Text>
      <Button type="secondary" size="small" onClick={toggleNotification}>
        x
      </Button>
    </div>
  ));
}

function notificationsFilter(data) {
  const notificationfetch =
    data &&
    data.nodeQuery &&
    data.nodeQuery.entities &&
    data.nodeQuery.entities.filter((notification) => notification);

  const notifications = notificationfetch ? notificationfetch : [];

  return notifications;
}

/**
 * wrapper to export
 * @param props
 * @return {JSX.Element}
 */
export default function wrapper(props) {
  const { isLoading, data, error } = useData(notificationsQuery());

  return <Notifications notificationObject={data} />;
}

Notifications.propTypes = {
  notificationObject: PropTypes.object,
};

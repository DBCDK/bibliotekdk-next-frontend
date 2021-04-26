import PropTypes from "prop-types";

import Text from "@/components/base/text/Text";
import React, { useState } from "react";
import { useData } from "@/lib/api/api";
import { notificationsQuery } from "@/lib/api/notification.fragment";
import styles from "./Notifications.module.css";
import classNames from "classnames/bind";
import BodyParser from "@/components/base/bodyparser/BodyParser";
import { Container } from "react-bootstrap";
import Icon from "@/components/base/icon/Icon";

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
  const toggleNotification = (index) => {
    sessionStorage.setItem("showme_" + index, "no");
    setShowNotification(!showNotification);
  };

  return notificationArray.map((notification, index) => (
    <div
      key={`${notification.fieldNotificationText}_${index}`}
      className={classNames(
        styles[`${notification.fieldNotificationType}`],
        styles.notification,
        sessionStorage.getItem("showme_" + index) === "no" ? styles.hidden : ""
      )}
    >
      <Container>
        <BodyParser body={notification.fieldNotificationText.value} />
        <Icon
          src={"close.svg"}
          size={{ w: "auto", h: "auto" }}
          className={styles.cancelicon}
          onClick={() => toggleNotification(index)}
        />
      </Container>
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

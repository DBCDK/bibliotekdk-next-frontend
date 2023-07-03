import PropTypes from "prop-types";
import React, { useState } from "react";
import { useData } from "@/lib/api/api";
import { notificationsQuery } from "@/lib/api/notification.fragment";
import styles from "./Notifications.module.css";
import cx from "classnames";
import BodyParser from "@/components/base/bodyparser/BodyParser";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Icon from "@/components/base/icon/Icon";
import { getLanguage } from "@/components/base/translate/Translate";
import Translate from "@/components/base/translate";
import animations from "css/animations";

/**
 * list of notifications
 * @param notificationArray
 * @return {unknown[]}
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
      className={cx(
        {
          [styles.warning]: notification.fieldNotificationType === "warning",
          [styles.error]: notification.fieldNotificationType === "error",
          [styles.info]: notification.fieldNotificationType === "info",
          [styles.success]: notification.fieldNotificationType === "success",
        },
        styles.notification,
        {
          [styles.hidden]: sessionStorage.getItem("showme_" + index) === "no",
        }
      )}
    >
      <Container fluid>
        <Row>
          <Col>
            <BodyParser body={notification.fieldNotificationText.value} />
          </Col>
          <Col xs={1}>
            <Icon
              src={"close.svg"}
              size={{ w: "auto", h: "auto" }}
              className={[
                styles.cancelicon,
                animations["on-focus"],
                animations["f-outline"],
              ].join(" ")}
              onClick={() => toggleNotification(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  toggleNotification(index);
                }
              }}
              alt={Translate({ context: "general", label: "close" })}
              tabIndex="0"
            />
          </Col>
        </Row>
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

  return notificationfetch ? notificationfetch : [];
}

/**
 * wrapper to export
 * @return {JSX.Element}
 */
export default function Wrap() {
  const langcode = { language: getLanguage() };
  const { data } = useData(notificationsQuery(langcode));

  return <Notifications notificationObject={data} />;
}

Notifications.propTypes = {
  notificationObject: PropTypes.object,
};

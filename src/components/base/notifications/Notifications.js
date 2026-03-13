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
import { getLocale } from "@/components/base/translate/Translate";
import Translate from "@/components/base/translate";
import animations from "@/components/base/animation/animations.module.css";
import { getSessionStorageItem, setSessionStorageItem } from "@/lib/utils";

/**
 * list of notifications
 * @param notificationArray
 * @returns {unknown[]}
 */
export function Notifications({ notificationObject }) {
  // check and make it an array
  const notificationArray = notificationsFilter(notificationObject);

  const [showNotification, setShowNotification] = useState(true);
  const toggleNotification = (documentId) => {
    setSessionStorageItem("showme_" + documentId, "no");
    setShowNotification(!showNotification);
  };

  return notificationArray.map((notification) => (
    <div
      key={notification.documentId}
      className={cx(
        {
          [styles.warning]: notification.type === "warning",
          [styles.error]: notification.type === "error",
          [styles.info]: notification.type === "info",
          [styles.success]: notification.type === "success",
        },
        styles.notification,
        {
          [styles.hidden]:
            getSessionStorageItem("showme_" + notification.documentId) === "no",
        }
      )}
    >
      <Container fluid>
        <Row>
          <Col>
            <BodyParser body={notification.text} />
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
              onClick={() => toggleNotification(notification.documentId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  toggleNotification(notification.documentId);
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
  const notifications =
    data?.bibliotekdkCms?.notifications?.filter((n) => n) || [];

  return notifications;
}

/**
 * wrapper to export
 * @returns {React.JSX.Element}
 */
export default function Wrap() {
  const { data } = useData(notificationsQuery({ locale: getLocale() }));

  return <Notifications notificationObject={data} />;
}

Notifications.propTypes = {
  notificationObject: PropTypes.object,
};

/**
 * @file ReviewHeading handles the heading for LectorReviewPage
 */

import { workTypeTranslator } from "@/components/work/reservationbutton/ReservationButton";
import Section from "@/components/base/section";
import styles from "@/components/article/lectorreview/LectorReviewPage.module.css";
import Col from "react-bootstrap/Col";
import { LinkArrow } from "@/components/article/lectorreview/linkarrow/LinkArrow";
import Translate from "@/components/base/translate";
import { Title } from "@/components/base/title/Title";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateForHeaderWorkCard } from "@/components/base/materialcard/templatesForMaterialCard";
import * as PropTypes from "prop-types";

export function ReviewHeading({ propAndChildrenInput }) {
  const workTypeTranslated = workTypeTranslator(
    propAndChildrenInput?.workTypes
  );

  return (
    <Section
      space={false}
      divider={false}
      title={null}
      className={`${styles.top}`}
    >
      <Col
        xs={12}
        md={{ span: 10, offset: 1 }}
        lg={{ span: 12, offset: 0 }}
        className={`${styles.overview}`}
      >
        <div className={styles.back_button}>
          <LinkArrow orientation={"left"} textBorder={{ bottom: true }}>
            {[
              Translate({ context: "general", label: "back-to" }),
              " ",
              workTypeTranslated,
            ].join("")}
          </LinkArrow>
        </div>
        <div className={styles.title_box}>
          <Title type="title2" className={styles.title}>
            {Translate({ context: "reviews", label: "materialTitle-1" })} <br />{" "}
            {Translate({ context: "reviews", label: "materialTitle-2" })}
          </Title>
        </div>
        <div className={styles.work_card}>
          <MaterialCard
            propAndChildrenTemplate={templateForHeaderWorkCard}
            propAndChildrenInput={propAndChildrenInput}
          />
        </div>
      </Col>
    </Section>
  );
}
ReviewHeading.propTypes = {
  className: PropTypes.any,
  propAndChildrenInput: PropTypes.any,
};

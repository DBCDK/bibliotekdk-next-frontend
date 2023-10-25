/**
 * @file ReviewHeading handles the heading for LectorReviewPage
 */

import { workTypeTranslator } from "@/components/work/reservationbutton/utils";
import Section from "@/components/base/section";
import styles from "./ReviewHeading.module.css";
import Col from "react-bootstrap/Col";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateForHeaderWorkCard } from "@/components/base/materialcard/templates/templates";
import * as PropTypes from "prop-types";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ChevronLeft from "@/public/icons/chevron_left.svg";

/**
 * ReviewHeading includes the title of LectorReviews (Bibliotekets vurdering / Librarian's Assessment)
 * It also renders the {@link MaterialCard} of the reviewed material + the back button.
 * @param propAndChildrenInput
 * @returns {React.JSX.Element}
 */
export function ReviewHeading({ propAndChildrenInput }) {
  return (
    <Section
      space={false}
      divider={false}
      title={null}
      className={`${styles.top}`}
    >
      <Col xs={12} className={`${styles.overview}`}>
        <ReviewHeadingLink propAndChildrenInput={propAndChildrenInput} />
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
            colSizing={{ xs: "auto", lg: 10, xl: 8 }}
          />
        </div>
      </Col>
    </Section>
  );
}

export function ReviewHeadingLink({ propAndChildrenInput, className }) {
  const workTypeTranslated = workTypeTranslator(
    propAndChildrenInput?.workTypes
  );
  return (
    <div className={`${styles.back_button}  ${className}`}>
      <IconLink
        href={templateForHeaderWorkCard(propAndChildrenInput).link_href}
        border={{ bottom: true, top: false }}
        iconSrc={ChevronLeft}
      >
        {[
          Translate({ context: "general", label: "back-to" }),
          " ",
          workTypeTranslated,
        ].join("")}
      </IconLink>
    </div>
  );
}
ReviewHeading.propTypes = {
  propAndChildrenInput: PropTypes.any,
};

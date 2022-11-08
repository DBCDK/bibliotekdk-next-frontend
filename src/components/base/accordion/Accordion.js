import PropTypes from "prop-types";
import BootstrapAccordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";

import ExpandIcon from "@/components/base/animation/expand";

import Text from "@/components/base/text";

import styles from "./Accordion.module.css";
import animations from "@/components/base/animation/animations.module.css";

import BodyParser from "@/components/base/bodyparser";
import React from "react";
import useElementVisible from "@/components/hooks/useElementVisible";

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.title
 * @param {obj} props.children
 * @param {obj} props.eventKey (required!)
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Item({ title, subTitle, children, eventKey, onChange }) {
  const currentEventKey = React.useContext(AccordionContext);

  const { elementRef, hasBeenSeen } = useElementVisible({
    root: null,
    rootMargin: "150px",
    threshold: 1.0,
  });

  const isCurrentEventKey = !!(currentEventKey === eventKey);

  const onClick = useAccordionToggle(eventKey, () => {
    if (onChange) {
      onChange(!isCurrentEventKey);
    }
  });

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter" || e.keyCode === 13) {
      onClick();
    }
  };

  if (typeof children === "string") {
    children = <Text type="text2">{children}</Text>;
  }

  return (
    <Card className={styles.element} data-cy="accordion-item" ref={elementRef}>
      <Card.Header
        tabIndex="0"
        className={[
          styles.header,
          animations["on-hover"],
          animations["on-focus"],
          animations["f-outline"],
        ].join(" ")}
        onClick={onClick}
        onKeyPress={handleKeypress}
      >
        <div className={animations["f-translate-right"]}>
          <Text
            type="text2"
            className={[
              animations["h-color-blue"],
              animations["h-border-bottom"],
            ].join(" ")}
          >
            {title}
          </Text>
          {subTitle && <Text type="text4">{subTitle}</Text>}
        </div>
        <ExpandIcon open={isCurrentEventKey} size={4} />
      </Card.Header>
      <BootstrapAccordion.Collapse
        className={styles.content}
        eventKey={eventKey}
      >
        <Card.Body>
          {typeof children === "function"
            ? children(typeof window !== "undefined" ? hasBeenSeen : true)
            : children}
        </Card.Body>
      </BootstrapAccordion.Collapse>
    </Card>
  );
}

Item.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]),
  eventKey: PropTypes.string.isRequired,
};

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.data
 * @param {obj} props.className
 * @param {obj} props.defaultActiveKey mount section as open on the current index/key
 * See propTypes for specific props and types
 *
 * @returns {component}
 */

export default function Accordion({
  defaultActiveKey = null,
  data = null,
  className = "",
  children,
}) {
  data =
    data &&
    data.map((a, i) => (
      <Item
        title={a.title}
        subTitle={a.subTitle}
        key={`${a.title}_${i}`}
        eventKey={a.key || i.toString()}
      >
        <BodyParser body={a.content} />
      </Item>
    ));

  return (
    <BootstrapAccordion
      defaultActiveKey={defaultActiveKey}
      className={className}
      data-cy="accordion"
    >
      {data || children}
    </BootstrapAccordion>
  );
}

Accordion.propTypes = {
  data: PropTypes.array,
  defaultActiveKey: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

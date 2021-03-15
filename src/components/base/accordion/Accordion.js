import PropTypes from "prop-types";
import BootstrapAccordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";

import ExpandIcon from "@/components/base/animation/expand";

import Text from "@/components/base/text";

import styles from "./Accordion.module.css";

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

export function Item({ title, children, eventKey }) {
  const currentEventKey = React.useContext(AccordionContext);

  const onClick = useAccordionToggle(eventKey);

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter" || e.keyCode === 13) {
      onClick();
    }
  };

  const isCurrentEventKey = !!(currentEventKey === eventKey);

  if (typeof children === "string") {
    children = <Text type="text2">{children}</Text>;
  }

  return (
    <Card className={styles.element} data-cy="accordion-item">
      <Card.Header
        tabIndex="0"
        className={styles.header}
        onClick={onClick}
        onKeyPress={handleKeypress}
      >
        <Text type="text1">{title}</Text>
        <ExpandIcon open={isCurrentEventKey} size={4} />
      </Card.Header>
      <BootstrapAccordion.Collapse
        className={styles.content}
        eventKey={eventKey}
      >
        <Card.Body>{children}</Card.Body>
      </BootstrapAccordion.Collapse>
    </Card>
  );
}

Element.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
        key={`${a.title}_${i}`}
        eventKey={a.key || i.toString()}
      >
        {a.content}
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

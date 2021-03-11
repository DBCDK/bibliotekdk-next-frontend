import BootstrapAccordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";

import ExpandIcon from "@/components/base/animation/expand";

import Icon from "@/components/base/icon";
import Text from "@/components/base/text";

import styles from "./Accordion.module.css";

function Element({ title, text, eventKey }) {
  const currentEventKey = React.useContext(AccordionContext);

  const onClick = useAccordionToggle(eventKey);

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter" || e.keyCode === 13) {
      onClick();
    }
  };

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Card className={styles.element}>
      <Card.Header
        tabIndex="0"
        className={styles.header}
        onClick={onClick}
        onKeyPress={handleKeypress}
      >
        <Text type="text1">{title}</Text>
        <ExpandIcon open={!!isCurrentEventKey} size={4} />
      </Card.Header>
      <BootstrapAccordion.Collapse
        className={styles.content}
        eventKey={eventKey}
      >
        <Card.Body>{text}</Card.Body>
      </BootstrapAccordion.Collapse>
    </Card>
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.defaultActiveKey mount section as open on the current index/key
 * See propTypes for specific props and types
 *
 * @returns {component}
 */

export default function Accordion({ defaultActiveKey = null, data }) {
  return (
    <BootstrapAccordion defaultActiveKey={defaultActiveKey}>
      {data.map((a, i) => (
        <Element
          {...a}
          key={`${a.title}_${i}`}
          eventKey={a.key || i.toString()}
        />
      ))}
    </BootstrapAccordion>
  );
}

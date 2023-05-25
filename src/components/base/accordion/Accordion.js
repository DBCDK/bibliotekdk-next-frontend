import PropTypes from "prop-types";
import BootstrapAccordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";

import ExpandIcon from "@/components/base/animation/expand";

import Text from "@/components/base/text";

import styles from "./Accordion.module.css";
import animations from "@/components/base/animation/animations.module.css";

import BodyParser from "@/components/base/bodyparser";
import React, { useEffect } from "react";
import useElementVisible from "@/components/hooks/useElementVisible";
import { useRouter } from "next/router";
import Link from "@/components/base/link";

// A variable indicating if an accordion has been rendered
// Used to determine if we should scroll to anchor.
// We only want to scroll at initial load
let firstAccordionRender = true;

/**
 * The Component function
 *
 * @param {obj} props
 * @param {obj} props.title
 * @param {obj} props.children
 * @param {string} props.eventKey (required!)
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Item({
  title,
  subTitle,
  additionalTxt,
  children,
  eventKey,
  onChange,
  id,
  isLoading,
}) {
  const router = useRouter();
  const context = React.useContext(AccordionContext);

  const { elementRef, hasBeenSeen } = useElementVisible({
    root: null,
    rootMargin: "150px",
    threshold: 1.0,
  });

  const isCurrentEventKey = context.activeEventKey === eventKey;

  const onClick = useAccordionButton(eventKey, () => {
    if (id && `#${id}` !== window.location.hash) {
      router.replace(`${router.asPath.split("#")[0]}#${id}`);
    }
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

  // Check if this item should be opened at mount time,
  // considering the anchor hash from the URL
  useEffect(() => {
    if (firstAccordionRender && id && `#${id}` === window.location.hash) {
      setTimeout(() => {
        onClick();
        window.scrollTo({
          behavior: "smooth",
          top:
            elementRef?.current?.getBoundingClientRect()?.top -
            document.body.getBoundingClientRect().top -
            80,
        });
      }, 500);
    }
  }, []);

  if (typeof children === "string") {
    children = <Text type="text2">{children}</Text>;
  }

  return (
    <Card className={styles.element} data-cy="accordion-item" ref={elementRef}>
      <Card.Header
        tabIndex="0"
        className={[
          styles.header,
          isCurrentEventKey && styles.open,
          animations.underlineContainer__only_internal_animations,
        ].join(" ")}
        onClick={onClick}
        onKeyDown={handleKeypress}
      >
        <div
          className={[
            animations["f-translate-right"],
            // if additional text is to be shown we need to set a wwidth (.firstelement)
            // of first element in accordion header
            additionalTxt && styles.firstelement,
          ].join(" ")}
        >
          <Link tag={"span"}>
            <Text type="text2" skeleton={isLoading} lines="1" tag={"span"}>
              {title}
            </Text>
          </Link>
          {subTitle && <Text tag={"span"} type="text4"></Text>}
        </div>
        {additionalTxt && (
          <div className={styles.textbox}>
            {additionalTxt?.map((txt, index) => (
              <Text tag={"span"} type="text2" key={`addition-${index}`}>
                {txt}
              </Text>
            ))}
          </div>
        )}
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
  id: PropTypes.string,
};

export function AccordionSkeleton({ className }) {
  const dummy = [
    { title: "lorem ipsum dolor sit amet" },
    { title: "lorem ipsum dolor" },
  ];

  return (
    <BootstrapAccordion
      className={`${styles.skeleton} ${className}`}
      data-cy="accordion"
    >
      {dummy?.map((a, i) => (
        <Item
          title={a.title}
          key={`${a.title}_${i}`}
          eventKey={a.key || i.toString()}
          isLoading={true}
        >
          <BodyParser body={a.content} />
        </Item>
      ))}
    </BootstrapAccordion>
  );
}

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
  isLoading,
}) {
  useEffect(() => {
    firstAccordionRender = false;
  }, []);

  if (isLoading) {
    return <AccordionSkeleton className={className} />;
  }

  data = data?.map((a, i) => (
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

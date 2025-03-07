import PropTypes from "prop-types";
import BootstrapAccordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";

import ExpandIcon from "@/components/base/animation/expand";

import Text from "@/components/base/text";
import Title from "@/components/base/title";

import styles from "./Accordion.module.css";
import animations from "@/components/base/animation/animations.module.css";

import BodyParser from "@/components/base/bodyparser";
import React, { useEffect, useState } from "react";
import useElementVisible from "@/components/hooks/useElementVisible";
import { useRouter } from "next/router";
import Link from "@/components/base/link";
import cx from "classnames";

/**
 * The Component function
 *
 * @param {Object} props
 * @param {Object} props.title
 * @param {ReactElement|function|string} props.children
 * @param {string} props.eventKey (required!)
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
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
  CustomHeaderComponent,
  useScroll = true,
  className,
  // if true, the expand icon will have a circle around it
  iconSize = 4,
  bgColor,
  iconColor,
  headerContentClassName,
}) {
  const [scrolledToHash, setScrolledToHash] = useState(false);
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
      router.replace({
        pathname: router.pathname,
        query: router.query,
        hash: id,
      });
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
    if (!scrolledToHash && id && `#${id}` === window.location.hash) {
      setTimeout(() => {
        onClick();
        useScroll &&
          window.scrollTo({
            behavior: "smooth",
            top:
              elementRef?.current?.getBoundingClientRect()?.top -
              document.body.getBoundingClientRect().top -
              80,
          });
      }, 500);
    }
    setScrolledToHash(true);
  }, []);

  if (typeof children === "string") {
    children = <Text type="text2">{children}</Text>;
  }

  return (
    <Card
      className={[styles.element, className].join(" ")}
      data-cy="accordion-item"
      ref={elementRef}
    >
      <Card.Header
        as={Link}
        border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
        // Card.Header
        tabIndex="0"
        className={[
          styles.wrapper,
          isCurrentEventKey && styles.open,
          animations.underlineContainer__only_internal_animations,
        ].join(" ")}
        onClick={onClick}
        onKeyDown={handleKeypress}
        role="button"
        id={`accordion-unique-toggle-${eventKey}-${title}`}
        aria-controls={`accordion-unique-${eventKey}-${title}`}
        aria-expanded={isCurrentEventKey}
      >
        {CustomHeaderComponent ? (
          <CustomHeaderComponent
            onClick={onClick}
            onKeyDown={handleKeypress}
            expanded={isCurrentEventKey}
          />
        ) : (
          <div className={cx(styles.header_content, headerContentClassName)}>
            <div
              className={[
                animations["f-translate-right"],
                // if additional text is to be shown we need to set a wwidth (.firstelement)
                // of first element in accordion header
                additionalTxt && styles.firstelement,
              ].join(" ")}
            >
              <Link tag="span" className={styles.link_on_year} tabIndex={-1}>
                <Title type="text2" skeleton={isLoading} lines={1} tag="h3">
                  {title}
                </Title>
              </Link>
              {subTitle && (
                <Text tag={"span"} type="text4">
                  {subTitle}
                </Text>
              )}
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
            <div className={styles.expandIcon}>
              <ExpandIcon
                open={isCurrentEventKey}
                size={iconSize}
                src="smallplus.svg"
                bgColor={bgColor}
                iconColor={iconColor}
              />
            </div>
          </div>
        )}
      </Card.Header>

      <div>
        <BootstrapAccordion.Collapse
          eventKey={eventKey}
          role="region"
          id={`accordion-unique-${eventKey}-${title}`}
          aria-labelledby={`accordion-unique-toggle-${eventKey}-${title}`}
        >
          {/* avoid choppy animation on collapse */}
          <div className={styles.content}>
            <Card.Body>
              {typeof children === "function"
                ? children(typeof window !== "undefined" ? hasBeenSeen : true)
                : children}
            </Card.Body>
          </div>
        </BootstrapAccordion.Collapse>
      </div>
    </Card>
  );
}

Item.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]),
  eventKey: PropTypes.string.isRequired,
  id: PropTypes.string,
  additionalTxt: PropTypes.array,
};

/**
 *
 * @param className
 * @returns {React.JSX.Element}
 */
export function AccordionSkeleton({ className }) {
  const dummy = [
    { title: "lorem ipsum dolor sit amet" },
    { title: "lorem ipsum dolor" },
  ];

  return (
    <BootstrapAccordion
      className={`${styles.skeleton}, ${className}`}
      data-cy="accordion"
    >
      <>
        {dummy.map((a, i) => (
          <Item
            title={a.title}
            key={`${a.title}_${i}`}
            eventKey={a.key || i.toString()}
            isLoading={true}
          >
            <BodyParser body={a.content} />
          </Item>
        ))}
      </>
    </BootstrapAccordion>
  );
}

/**
 * The Component function
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {string} props.className
 * @param {string|string[]} props.defaultActiveKey mount section as open on the current index/key
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */

export default function Accordion({
  defaultActiveKey = null,
  data = null,
  className = "",
  children,
  isLoading,
  dataCy = null,
}) {
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
      className={cx(className)}
      data-cy={dataCy || "accordion"}
    >
      {data || children}
    </BootstrapAccordion>
  );
}

Accordion.propTypes = {
  data: PropTypes.array,
  defaultActiveKey: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.object,
  ]),
  dataCy: PropTypes.string,
};

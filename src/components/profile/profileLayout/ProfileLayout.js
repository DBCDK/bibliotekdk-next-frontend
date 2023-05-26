import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Title } from "@/components/base/title/Title";
import styles from "./ProfileLayout.module.css";
import ProfileMenu from "../profilemenu/desktop/ProfileMenu";
import NavigationDropdown from "@/components/base/dropdown/NavigationDropdown";
import useWindowSize from "@/components/hooks/useWindowSize";
import { useEffect, useState } from "react";
import useIsMobile from "@/components/hooks/useIsMobile";

const MAX_MOBILE_WIDTH = 375;
const CONTEXT = "profile";
const MENUITEMS = ["loansAndReservations", "myLibraries"];

/**
 * ProfileLayout to use in /profil subpages
 * Renders a side menu on left side and children on right side
 *
 * @returns {JSX.Element}
 */
export default function ProfileLayout({ title, children }) {
  //const windowSize = useWindowSize();

  const isMobile = useIsMobile();
  // useState(
  //   windowSize.width <= MAX_MOBILE_WIDTH
  // );

  // useEffect(() => {
  //   setIsMobile(windowSize.width <= MAX_MOBILE_WIDTH);
  // }, [windowSize.width]);

  return (
    <Container fluid className={styles.container}>
      {isMobile && (
        <NavigationDropdown context={CONTEXT} menuItems={MENUITEMS} />
      )}
      <Row>
        {!isMobile && (
          <Col md={3}>
            <ProfileMenu />
          </Col>
        )}
        <Col md={9}>
          {/**page content here */}
          <Title className={styles.title} type="title2" tag="h1">
            {title}
          </Title>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

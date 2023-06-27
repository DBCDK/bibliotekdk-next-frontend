import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Title } from "@/components/base/title";
import styles from "./ProfileLayout.module.css";
import ProfileMenu from "../profilemenu/desktop/ProfileMenu";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import NavigationDropdown from "@/components/base/dropdown/NavigationDropdown";

const CONTEXT = "profile";
const MENUITEMS = ["loansAndReservations", "myLibraries"];

/**
 * ProfileLayout to use in /profil subpages
 * Renders a side menu on left side (ProfileMenu), breadcrumb and children on right side for screen width above 1020px
 * and renders a dropdown menu (NavigationDropdown) for screen width below 1020px
 *
 * @returns {JSX.Element}
 */
export default function ProfileLayout({ title, children }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const isTablet = breakpoint === "md";

  return (
    <Container fluid className={styles.container}>
      {(isMobile || isTablet) && <Breadcrumb textType="text3" />}
      <NavigationDropdown context={CONTEXT} menuItems={MENUITEMS} />

      <Row>
        <Col lg={3} className={styles.navColumn}>
          {!isMobile && !isTablet && <Breadcrumb textType="text2" />}
          <ProfileMenu />
        </Col>
        <Col lg={9}>
          {/**page content here */}
          <Title
            className={styles.title}
            type={isMobile ? "title4" : "title2"}
            tag="h1"
          >
            {title}
          </Title>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

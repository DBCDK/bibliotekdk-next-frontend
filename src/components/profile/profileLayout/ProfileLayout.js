import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Title } from "@/components/base/title/Title";
import styles from "./ProfileLayout.module.css";
import ProfileMenu from "../profilemenu/desktop/ProfileMenu";
import NavigationDropdown from "@/components/base/dropdown/NavigationDropdown";

const CONTEXT = "profile";
const MENUITEMS = ["loansAndReservations", "myLibraries"];

/**
 * ProfileLayout to use in /profil subpages
 * Renders a side menu on left side (ProfileMenu) and children on right side for screen width above 1020px
 * and renders a dropdown menu (NavigationDropdown) for screen width below 1020px
 *
 * @returns {JSX.Element}
 */
export default function ProfileLayout({ title, children }) {
  return (
    <Container fluid className={styles.container}>
      <NavigationDropdown context={CONTEXT} menuItems={MENUITEMS} />
      <Row>
        <Col md={3}>
          <ProfileMenu />
        </Col>
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

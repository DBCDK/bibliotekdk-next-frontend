import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Title } from "@/components/base/title/Title";
import styles from "./ProfileLayout.module.css";
import ProfileMenu from "../profilemenu/ProfileMenu";

/**
 * Profile menu main items
 */
const menuItems = ["loansAndReservations", "myLibraries"];

/**
 * Menu items with subcategories
 */
const menus = {
  loansAndReservations: [
    { title: "debt", id: 0, itemLength: 0 },
    { title: "loans", id: 1, itemLength: 0 },
    { title: "orders", id: 2, itemLength: 0 },
  ],
};
/**
 * ProfileLayout to use in /profil subpages
 * Renders a side menu on left side and children on right side
 *
 * @returns {JSX.Element}
 */
export default function ProfileLayout({ title, children }) {
  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col md={3}>
          <ProfileMenu menus={menus} menuItems={menuItems} />
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

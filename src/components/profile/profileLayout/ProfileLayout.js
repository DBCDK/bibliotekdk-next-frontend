import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Title } from "@/components/base/title/Title";
import styles from "./ProfileLayout.module.css";
import ProfileMenu from "../profilemenu/ProfileMenu";
import useUser from "@/components/hooks/useUser";
/**
 * ProfileLayout to use in /profil subpages
 * Renders a side menu on left side and children on right side
 *
 * @returns {JSX.Element}
 */
export default function ProfileLayout({ title, children }) {
  const user = useUser();

  console.log("user", user);
  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col md={3}>
          <ProfileMenu />
        </Col>
        <Col md={9}>
          {/**page content here */}
          <Title className={styles.title} type="title2">
            {title}
          </Title>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

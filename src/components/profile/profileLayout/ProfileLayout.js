import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Title from "@/components/base/title";
import styles from "./ProfileLayout.module.css";
import ProfileMenu from "../profilemenu/desktop/ProfileMenu";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import NavigationDropdown from "@/components/base/dropdown/NavigationDropdown";
import useUser from "@/components/hooks/useUser";
import IconButton from "@/components/base/iconButton/IconButton";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate/Translate";

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
  const { loanerInfo } = useUser();
  const userName = loanerInfo?.userParameters?.userName;
  console.log("userName", userName);

  return (
    <Container fluid className={styles.container}>
      {(isMobile || isTablet) &&
      <div className={styles.profileHeaderContainer}>
      <Breadcrumb textType="text3" />
      <LogoutButton userName={userName} />

      </div>

      }
      <NavigationDropdown context={CONTEXT} menuItems={MENUITEMS} />

      <Row>
     
        {!isMobile && !isTablet &&    <LogoutButton userName={userName} />}
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

const LogoutButton = ({ userName }) => {
  return (
    <div className={styles.logoutContainer}>
      <Text className={styles.logoutBtnText}>{`${Translate({
        context: "profile",
        label: "signed-in-as-name",
      })} ${userName}`}</Text>
      <Link
        className={styles.logoutBtn}
        href="/profil/mine-biblioteker"
        border={{
          top: false,
          bottom: {
            keepVisible: true,
          },
        }}
      >
        <Text>
          {Translate({
            context: "header",
            label: "logout",
          })}
        </Text>
      </Link>
    </div>
  );
};

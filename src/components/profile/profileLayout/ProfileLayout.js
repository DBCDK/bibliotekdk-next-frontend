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
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate/Translate";
import { signOut } from "@dbcdk/login-nextjs/client";
import Button from "@/components/base/button";
import { useModal } from "@/components/_modal";
import Router from "next/router";
import { openLoginModal } from "@/components/_modal/pages/login/utils";

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
  const isDesktop = !isMobile && !isTablet;
  const user = useUser();
  const modal = useModal();

  return (
    <Container fluid className={styles.container}>
      {(isMobile || isTablet) && (
        <div className={styles.profileHeaderContainer}>
          <Breadcrumb textType="text3" />
          <LogoutButton />
        </div>
      )}
      <NavigationDropdown context={CONTEXT} menuItems={MENUITEMS} />

      <Row>
        {isDesktop && <LogoutButton />}
        <Col lg={3} className={styles.navColumn}>
          {isDesktop && <Breadcrumb textType="text2" />}
          <ProfileMenu />
        </Col>
        <Col lg={9}>
          {/**page content here */}
          {user?.isAuthenticated ? (
            <>
              <Title
                className={styles.title}
                type={isMobile ? "title4" : "title2"}
                tag="h1"
              >
                {title}
              </Title>
              {children}
            </>
          ) : (
            <div>
              <Title className={styles.loginTitle} tag="h2" type="title3">
                {Translate({
                  context: "header",
                  label: "login",
                })}
              </Title>
              <Text className={styles.loginText} type="text2">
                {Translate({
                  context: "profile",
                  label: "login-to-see-profile",
                })}
              </Text>
              <Text type="text2">
                {Translate({
                  context: "profile",
                  label: "login-welcome",
                })}
              </Text>

              <Button
                dataCy="profile-layout-button-login"
                className={styles.loginButton}
                size="large"
                type="primary"
                onClick={() => openLoginModal({ modal })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.keyCode === 13)
                    openLoginModal({ modal });
                }}
              >
                {Translate({
                  context: "header",
                  label: "login",
                })}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

const LogoutButton = () => {
  const user = useUser();

  if (!user.isAuthenticated) {
    return;
  }
  const userName = user?.loanerInfo?.userParameters?.userName;
  return (
    <div className={styles.logoutContainer}>
      <Text className={styles.logoutBtnText}>{`${Translate({
        context: "profile",
        label: "signed-in-as-name",
      })} ${userName}`}</Text>
      <Link
        onClick={() => {
          if (user.isAuthenticated) {
            signOut(null, "/");
          } else if (user.isGuestUser) {
            user.guestLogout();
            Router.push("/");
          }
        }}
        className={styles.logoutBtn}
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

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Title from "@/components/base/title";
import styles from "./ProfileLayout.module.css";
import ProfileMenu from "../profilemenu/desktop/ProfileMenu";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import NavigationDropdown from "@/components/base/dropdown/navigationDropdown/NavigationDropdown";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate/Translate";
import { signOut } from "@dbcdk/login-nextjs/client";
import Button from "@/components/base/button";
import { useModal } from "@/components/_modal";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import { useRouter } from "next/router";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import { useEffect } from "react";

const CONTEXT = "profile";
const MENUITEMS = [
  "loansAndReservations",
  "bookmarks",
  "myLibraries",
  "orderHistory",
  "myProfile",
];

/* Whitelist menuitems accessable without login */
const WHITELIST = ["/profil/huskeliste"];

/**
 * ProfileLayout to use in /profil subpages
 * Renders a side menu on left side (ProfileMenu), breadcrumb and children on right side for screen width above 1020px
 * and renders a dropdown menu (NavigationDropdown) for screen width below 1020px
 *
 * @returns {React.JSX.Element}
 */
export default function ProfileLayout({ title, children }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const isTablet = breakpoint === "md";
  const isDesktop = !isMobile && !isTablet;
  const { hasCulrUniqueId, isAuthenticated, isLoading } = useAuthentication();

  const modal = useModal();
  const router = useRouter();

  const isWhitelistPath = WHITELIST.includes(router.pathname);

  const showProfile = hasCulrUniqueId || isWhitelistPath;
  const showLoginToSeeProfile = !isWhitelistPath && !isAuthenticated;

  return (
    <Container fluid className={styles.container}>
      {(isMobile || isTablet) && (
        <div className={styles.profileHeaderContainer}>
          <Breadcrumb textType="text3" />
          <LogoutButton />
        </div>
      )}

      {hasCulrUniqueId && (
        <NavigationDropdown context={CONTEXT} menuItems={MENUITEMS} />
      )}

      <Row>
        {isDesktop && <LogoutButton />}
        <Col lg={3} className={styles.navColumn}>
          {hasCulrUniqueId && isDesktop && <Breadcrumb textType="text2" />}
          {hasCulrUniqueId && <ProfileMenu />}
        </Col>
        <Col lg={9}>
          {/**page content here */}
          {showProfile && (
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
          )}
          {showLoginToSeeProfile && (
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
  const { isAuthenticated } = useAuthentication();
  const { loanerInfo, isLoading } = useLoanerInfo();

  if (!isAuthenticated) {
    return;
  }
  const userName = loanerInfo?.userParameters?.userName;
  return (
    <div className={styles.logoutContainer}>
      {userName && (
        <Text className={styles.logoutBtnText} skeleton={isLoading} lines={1}>
          {`${Translate({
            context: "profile",
            label: "signed-in-as-name",
          })} 
        ${userName}
       `}
        </Text>
      )}
      <Link
        onClick={() => {
          if (isAuthenticated) {
            const redirectUrl = window?.location?.origin;
            signOut(redirectUrl);
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

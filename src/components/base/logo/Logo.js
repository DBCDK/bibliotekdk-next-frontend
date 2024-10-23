import PropTypes from "prop-types";
import styles from "./Logo.module.css";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import useTestUser from "@/components/hooks/useTestUser";
import Image from "next/image";
import useAgencyFromSubdomain from "@/components/hooks/useSubdomainToAgency";

/**
 * Mark when test user mode is active
 */
function TestUserActive() {
  const { enabled } = useTestUser();
  if (!enabled) {
    return null;
  }

  return (
    <div
      style={{
        background: "brown",
        height: 4,
        width: 160,
        marginTop: 8,
        position: "absolute",
      }}
    ></div>
  );
}
/**
 * Component is a svg and some text.
 * @param href
 *  Where to go when clicked
 * @param type
 *  Color of text and svg logo
 * @returns {React.JSX.Element}
 */
export default function Logo({ href = "/" }) {
  const { logoPath } = useAgencyFromSubdomain();

  if (!logoPath) {
    return null;
  }

  return (
    <Link
      border={false}
      href={href}
      dataCy={cyKey({
        name: "logo",
      })}
    >
      <div className={styles.display_flex}>
        <Image src={logoPath} alt="logo" width={200} height={50} />
      </div>
      <TestUserActive />
    </Link>
  );
}

// PropTypes for Button component
Logo.propTypes = {
  href: PropTypes.string,
};

import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";
import Router, { useRouter } from "next/router";
import styles from "./digitalCopy.module.css";
import useUser from "@/components/hooks/useUser";
import { signIn } from "@dbcdk/login-nextjs/client";

export default function DigitalCopy({
  url,
  origin,
  note,
  className,
  materialType,
  workId,
}) {
  const context = { context: "options" };
  const router = useRouter();
  const user = useUser();

  const digiClick = () => {
    if (!user.isAuthenticated) {
      signIn();
    } else {
      alert("not implemented");
      // @TODO do a order like:
      /*
      Router.push(
        {
          pathname: Router.pathname,
          query: {
            ...Router.query,
            order: "870971-tsart:36160780",
            modal: `order`,
          },
        },
        null,
        { shallow: true, scroll: false }
      );
       */
    }
  };

  return (
    <li className={`${className} ${styles.item}`}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        href={url}
        target="_blank"
        onClick={() => digiClick()}
      >
        <Text type="text1">
          {Translate({
            ...context,
            label: "digital-copy-link-title",
          })}
        </Text>
      </Link>
      {note ? (
        <Text type="text3">{note}</Text>
      ) : (
        <Text type="text3">
          {Translate({
            ...context,
            label: "digital-copy-link-description",
          })}
        </Text>
      )}
    </li>
  );
}

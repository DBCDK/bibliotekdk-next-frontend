import Text from "@/components/base/text";
import Link from "@/components/base/link";

import Translate from "@/components/base/translate";

import styles from "./physicalCopy.module.css";
import { useRouter } from "next/router";

/**
 * Get pid from workid.
 * @param workId
 * @return {string}
 */
function parseForPid(workId) {
  const parts = workId.split(":");
  return `${parts[1]}:${parts[2]}`;
}

/**
 * Push needed parameters for an order to router.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export function PhysicalCopy({ props }) {
  const { workId, className, router } = { ...props };

  const pid = parseForPid(workId);

  const context = { context: "options" };
  const onClickToris = () => {
    if (router) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            order: `${pid}`,
            modal: `order`,
          },
        },
        null,
        { shallow: true, scroll: false }
      );
    } else {
      alert("fisk");
    }
  };

  return (
    <li className={`${className} ${styles.item}`} key="options-physicalcopy">
      <Link border={{ bottom: { keepVisible: true } }} onClick={onClickToris}>
        <Text type="text1">
          {Translate({
            ...context,
            label: "order-physical-copy",
          })}
        </Text>
      </Link>
      <Text type="text3">
        {Translate({
          ...context,
          label: "order-physical-copy-description",
        })}
      </Text>
    </li>
  );
}

/**
 * default export function
 * @param props
 * @return {JSX.Element}
 */
export default function wrap({ props }) {
  const router = useRouter();
  const params = { ...props, router: { ...router } };
  return <PhysicalCopy props={params} />;
}

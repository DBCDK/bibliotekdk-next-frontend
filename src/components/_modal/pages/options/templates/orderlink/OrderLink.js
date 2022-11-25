import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import styles from "./OrderLink.module.css";

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
 * @param onOrder
 * @param combined
 * @param digitalOnly
 * @return {JSX.Element}
 * @constructor
 */
export function OrderLink({
  props,
  onOrder = () => {},
  combined,
  digitalOnly,
}) {
  const { workId, className } = { ...props };

  const pid = parseForPid(workId);

  const context = { context: "options" };
  return (
    <li className={`${className} ${styles.item}`}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        onClick={() => {
          onOrder(pid);
        }}
      >
        <Text type="text1">
          {Translate({
            ...context,
            label: digitalOnly
              ? "digital-copy-link-title"
              : combined
              ? "order-combined-copy"
              : "order-physical-copy",
          })}
        </Text>
      </Link>
      <Text type="text3">
        {Translate({
          ...context,
          label: digitalOnly
            ? "digital-copy-link-description"
            : combined
            ? "order-combined-copy-description"
            : "order-physical-copy-description",
        })}
      </Text>
    </li>
  );
}

/**
 * default export function
 * @param props
 * @param combined
 * @param digitalOnly
 * @return {JSX.Element}
 */
export default function Wrap({ props, combined, digitalOnly }) {
  const { modal, workId, materialType: type } = { ...props };
  return (
    <OrderLink
      props={props}
      onOrder={(pid) =>
        modal.push("order", {
          title: Translate({ context: "modal", label: "title-order" }),
          pid,
          workId,
          type,
          orderType: "singleManifestation",
        })
      }
      combined={combined}
      digitalOnly={digitalOnly}
    />
  );
}

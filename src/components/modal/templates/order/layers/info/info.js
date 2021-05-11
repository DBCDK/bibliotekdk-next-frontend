import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import Input from "@/components/base/forms/input";
import Cover from "@/components/base/cover";
import { Arrow } from "@/components/article/preview";

import styles from "./Info.module.css";

export default function Info({
  material,
  user,
  className,
  onLayerSelect,
  pickupBranch,
  onMailChange,
}) {
  // Mateiral props
  const { title, creators, materialType, cover } = material;

  const { name, mail } = user;

  const context = { context: "order" };

  return (
    <div className={`${styles.info} ${className}`}>
      <div className={styles.edition}>
        <div className={styles.left}>
          <Text type="text1" className={styles.title}>
            {title}
          </Text>
          <Text type="text3" className={styles.creators}>
            {creators.map((c, i) =>
              creators.length > i + 1 ? c.name + ", " : c.name
            )}
          </Text>
          <div className={styles.material}>
            <Tag tag="span">{materialType}</Tag>
            <Link onClick={() => onLayerSelect("edition")} disabled>
              <Text type="text3">
                {Translate({ ...context, label: "no-specific-edition" })}
              </Text>
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <Cover src={cover?.detail} size="thumbnail" />
        </div>
      </div>

      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5">
            {Translate({ ...context, label: "pickup-title" })}
          </Title>
        </div>
        <div className={styles.library}>
          <Text type="text1">{pickupBranch?.name}</Text>
          <div>
            <Link
              onClick={() => onLayerSelect("pickup")}
              border={{ bottom: { keepVisible: true } }}
            >
              <Text type="text3">
                {Translate({ ...context, label: "pickup-link" })}
              </Text>
            </Link>
            <Arrow className={styles.arrow} />
          </div>
        </div>
        <div className={styles.address}>
          <Text type="text3">{pickupBranch?.postalAddress}</Text>
          <Text type="text3">{`${pickupBranch?.postalCode} ${pickupBranch?.city}`}</Text>
        </div>
      </div>

      <div className={styles.user}>
        <Title type="title5">
          {Translate({ ...context, label: "ordered-by" })}
        </Title>
        <div className={styles.name}>
          <Text type="text1">{name}</Text>
        </div>
        <div className={styles.email}>
          <label htmlFor="order-user-email">
            <Text type="text1">
              {Translate({ context: "general", label: "email" })}
            </Text>
          </label>
          <Input
            value={mail || ""}
            id="order-user-email"
            onChange={(value, valid) => valid && onMailChange(value)}
            readOnly={mail}
          />
        </div>
        <div className={styles.message}>
          <Text type="text3">
            {Translate({
              ...context,
              label: "order-message",
              vars: [pickupBranch?.name],
            })}
          </Text>
        </div>
      </div>
    </div>
  );
}

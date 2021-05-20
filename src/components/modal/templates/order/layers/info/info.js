import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import Email from "@/components/base/forms/email";
import Cover from "@/components/base/cover";
import Arrow from "@/components/base/animation/arrow";

import animations from "@/components/base/animation/animations.module.css";

import styles from "./Info.module.css";

export default function Info({
  material,
  user,
  className,
  onLayerSelect,
  pickupBranch,
  onMailChange,
  isVisible,
  isLoading,
}) {
  // Mateiral props
  const { title, creators, materialType, cover } = material;

  const { name, mail } = user;

  const context = { context: "order" };

  return (
    <div className={`${styles.info} ${className}`}>
      <div className={styles.edition}>
        <div className={styles.left}>
          <div className={styles.title}>
            <Text type="text1" skeleton={isLoading} lines={1}>
              {title}
            </Text>
          </div>
          <div className={styles.creators}>
            <Text type="text3" skeleton={isLoading} lines={1}>
              {creators.map((c, i) =>
                creators.length > i + 1 ? c.name + ", " : c.name
              )}
            </Text>
          </div>
          <div className={styles.material}>
            <Tag tag="span" skeleton={isLoading}>
              {materialType}
            </Tag>
            <Link onClick={() => onLayerSelect("edition")} disabled>
              <Text type="text3" skeleton={isLoading} lines={1}>
                {Translate({ ...context, label: "no-specific-edition" })}
              </Text>
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <Cover src={cover?.detail} size="thumbnail" skeleton={isLoading} />
        </div>
      </div>

      <div className={styles.pickup}>
        <div className={styles.title}>
          <Title type="title5">
            {Translate({ ...context, label: "pickup-title" })}
          </Title>
        </div>
        <div className={styles.library}>
          <Text type="text1" skeleton={isLoading} lines={1}>
            {pickupBranch?.name}
          </Text>
          <div
            className={`${styles.link} ${animations["on-hover"]} `}
            onClick={() => onLayerSelect("pickup")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                onLayerSelect("pickup");
              }
            }}
          >
            <Link
              className={`${animations["on-focus"]}`}
              disabled={isLoading}
              onClick={(e) => e.preventDefault()}
              border={{ bottom: { keepVisible: !isLoading } }}
              tabIndex={isVisible ? "0" : "-1"}
            >
              <Text type="text3">
                {Translate({ ...context, label: "pickup-link" })}
              </Text>
            </Link>
            <Arrow
              className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
            />
          </div>
        </div>
        <div className={styles.address}>
          <Text type="text3" skeleton={isLoading} lines={2}>
            {pickupBranch?.postalAddress}
          </Text>
          <Text
            type="text3"
            skeleton={isLoading}
            lines={0}
          >{`${pickupBranch?.postalCode} ${pickupBranch?.city}`}</Text>
        </div>
      </div>

      <div className={styles.user}>
        <Title type="title5">
          {Translate({ ...context, label: "ordered-by" })}
        </Title>
        <div className={styles.name}>
          <Text type="text1" skeleton={isLoading} lines={1}>
            {name}
          </Text>
        </div>
        <div className={styles.email}>
          <label htmlFor="order-user-email">
            <Text type="text1">
              {Translate({ context: "general", label: "email" })}
            </Text>
          </label>
          <Email
            disabled={isLoading || !!mail}
            tabIndex={isVisible ? "0" : "-1"}
            value={mail || ""}
            id="order-user-email"
            onBlur={(value, valid) => onMailChange(value, valid)}
            readOnly={!!mail}
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

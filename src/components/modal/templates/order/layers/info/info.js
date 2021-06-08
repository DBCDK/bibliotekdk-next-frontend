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
  validated,
}) {
  const context = { context: "order" };

  // Mateiral props
  const { title, creators, materialType, cover } = material;

  // user props
  const { name, mail: userMail, agency } = user;

  // Only show validation if user has already tried to submit order (but validation failed)
  const hasTry = validated?.hasTry;

  // Get email messages (from validate object)
  const emailStatus = validated?.details?.hasMail?.status;
  const errorMessage = validated?.details?.hasMail?.message;

  const libraryFallback = Translate({
    context: "general",
    label: "your-library",
  });

  // If user profile has an email, email field will be locked and this message shown
  const lockedMessage = {
    context: "order",
    label: "info-email-message",
    vars: [agency?.name || libraryFallback],
  };

  const messageFromLibrary = {
    context: "order",
    label: "order-message-library",
  };

  // Set email input message if any
  const message = (hasTry && errorMessage) || messageFromLibrary;

  // Email validation class'
  const validClass = hasTry && !emailStatus ? styles.invalid : styles.valid;
  const customInvalidClass = hasTry && !emailStatus ? styles.invalidInput : "";

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
              <Text type="text3" className={styles.fullLink}>
                {Translate({ ...context, label: "pickup-link" })}
              </Text>
              <Text type="text3" className={styles.shortLink}>
                {Translate({ context: "general", label: "select" })}
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

          {userMail && lockedMessage && (
            <div className={`${styles.emailMessage}`}>
              <Text type="text3">{Translate(lockedMessage)}</Text>
            </div>
          )}
          <Email
            placeholder={Translate({
              context: "form",
              label: "email-placeholder",
            })}
            invalidClass={customInvalidClass}
            required={true}
            disabled={isLoading || !!userMail}
            tabIndex={isVisible ? "0" : "-1"}
            value={userMail || ""}
            id="order-user-email"
            onBlur={(value, valid) => onMailChange(value, valid)}
            onMount={(value, valid) => onMailChange(value, valid)}
            readOnly={!!userMail}
            skeleton={isLoading}
          />

          {message && (
            <div className={`${styles.emailMessage} ${validClass}`}>
              <Text type="text3">{Translate(message)}</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

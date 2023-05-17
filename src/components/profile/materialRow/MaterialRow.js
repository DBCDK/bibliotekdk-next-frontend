import Cover from "@/components/base/cover/Cover";
import Button from "@/components/base/button/Button";
import Text from "@/components/base/text";
import styles from "./MaterialRow.module.css";
import Title from "@/components/base/title";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import ConditionalWrapper from "@/components/base/conditionalwrapper/ConditionalWrapper";
import Link from "@/components/base/link/Link";
import cx from "classnames";
import { useState } from "react";

/**
 * Use as renderButton if needed
 */
export const MaterialRowButton = ({ buttonText = null, buttonAction }) => {
  return (
    <div className={styles.buttonContainer}>
      <Button type="secondary" size="small" onClick={buttonAction}>
        {buttonText}
      </Button>
    </div>
  );
};

export const DynamicCloumn = ({ ...props }) => <Text type="text2" {...props} />;

const MaterialRow = ({
  image,
  title,
  creator,
  materialType,
  creationYear,
  library,
  dynamicColumn,
  hasCheckbox = false,
  id,
  status,
  renderButton,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <ConditionalWrapper
      condition={!hasCheckbox}
      wrapper={(children) => (
        <Link
          className={cx(styles.materialRow_wrapper, {
            [styles.materialRow_green]: status === "GREEN",
            [styles.materialRow_red]: status === "RED",
          })}
        >
          <article className={styles.materialRow}>{children}</article>
        </Link>
      )}
      elseWrapper={(children) => (
        <article
          role="checkbox"
          aria-checked={isChecked}
          tabIndex="0"
          aria-labelledby="chk1-label"
          data-id={id}
          onClick={() => setIsChecked(!isChecked)}
          className={cx(
            styles.materialRow,
            styles.materialRow_withCheckbox,
            styles.materialRow_wrapper
          )}
        >
          {children}
        </article>
      )}
    >
      <>
        {hasCheckbox && (
          <div>
            <Checkbox
              checked={isChecked}
              id={`material-row-${id}`}
              ariaLabel="TODO"
              tabIndex={-1}
            />
          </div>
        )}

        <div>
          <Cover src={image} size="fill-width" />
        </div>

        <div>
          {/* Make correct header */}
          <Title type="title8" as="h4">
            {title}
          </Title>
          <Text type="text2">{creator}</Text>
          <Text type="text2">
            {materialType}, {creationYear}
          </Text>
        </div>

        <div>
          <Text type="text2">{library}</Text>
        </div>

        <div>{dynamicColumn}</div>

        <div>{renderButton && renderButton}</div>
      </>
    </ConditionalWrapper>
  );
};

export default MaterialRow;

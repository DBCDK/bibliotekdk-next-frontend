import Cover from "@/components/base/cover";
import Button from "@/components/base/button";
import Text from "@/components/base/text";
import styles from "./MaterialRow.module.css";
import Title from "@/components/base/title";
import { Checkbox } from "@/components/base/forms/checkbox";
import ConditionalWrapper from "@/components/base/conditionalwrapper";
import Link from "@/components/base/link";
import cx from "classnames";
import { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@/components/base/iconButton";
import { getWorkUrl } from "@/lib/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { useModal } from "@/components/_modal";

/**
 * Use as renderButton if needed
 */
export const MaterialRowButton = ({ wrapperClassname, ...props }) => {
  return (
    <div className={cx(styles.buttonContainer, wrapperClassname)}>
      <Button type="primary" size="small" {...props} />
    </div>
  );
};

export const MaterialRowIconButton = ({ ...props }) => {
  return (
    <div className={styles.buttonContainer}>
      <IconButton {...props} />
    </div>
  );
};

export const DynamicColumn = ({ ...props }) => <p {...props} />;

export const MaterialHeaderRow = ({ column1, column2, column3 }) => {
  return (
    <div className={styles.materialHeaderRow}>
      <div>
        <Text type="text3">{column1}</Text>
      </div>
      <div>
        <Text type="text3">{column2}</Text>
      </div>
      <div>
        <Text type="text3">{column3}</Text>
      </div>
      <div />
    </div>
  );
};

/**
 * Use for checkbox functionality
 * @param ref of parent html element, which contains your group of material rows
 * @returns the 'data-id' of the material row (id from component parameter)
 */
export const getCheckedElements = (parentRef) => {
  const elements = [].slice.call(parentRef.current.children);
  const checkedElements = elements
    .filter((element) => element.ariaChecked === "true")
    .map((element) => element.getAttribute("data-id"));
  return checkedElements;
};

const MobileMaterialRow = (props) => {
  const {
    image,
    creator,
    materialType,
    creationYear,
    dynamicColumn,
    title,
    workId,
    id,
  } = props;
  const modal = useModal();

  const onClick = () => {
    modal.push("material", {
      label: "Dit lån",
      ...props,
      dynamicColumn: null,
      renderButton: null,
    });
  };

  return (
    <article
      className={styles.materialRow_mobile}
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
    >
      <div className={styles.imageContainer_mobile}>
        <Cover src={image} size="fill-width" />
      </div>
      <div>
        <ConditionalWrapper
          condition={!!title && !!creator && !!id}
          wrapper={(children) => (
            <Link href={getWorkUrl(title, creator, workId)}>{children}</Link>
          )}
        >
          <Title
            type="title8"
            as="h3"
            className={styles.materialTitle}
            id={`material-title-${id}`}
          >
            {title}
          </Title>
        </ConditionalWrapper>
        {creator && <Text type="text2">{creator}</Text>}
        {materialType && creationYear && (
          <Text type="text2">
            {materialType}, {creationYear}
          </Text>
        )}
        <div className={styles.dynamicColumn_mobile}>{dynamicColumn}</div>
      </div>
    </article>
  );
};

const MaterialRow = (props) => {
  const {
    image,
    title,
    creator,
    materialType,
    creationYear,
    library,
    dynamicColumn,
    hasCheckbox = false,
    id,
    status = "NONE",
    renderButton,
    workId,
  } = props;
  const [isChecked, setIsChecked] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";

  if (isMobileSize) return <MobileMaterialRow {...props} />;

  return (
    <ConditionalWrapper
      condition={hasCheckbox}
      wrapper={(children) => (
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
            styles.materialRow_wrapper,
            {
              [styles.materialRow_green]: status === "GREEN",
              [styles.materialRow_red]: status === "RED",
            }
          )}
        >
          {children}
        </article>
      )}
      elseWrapper={(children) => (
        <article
          className={cx(styles.materialRow, styles.materialRow_wrapper, {
            [styles.materialRow_green]: status === "GREEN",
            [styles.materialRow_red]: status === "RED",
          })}
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
              aria-labelledby={`material-title-${id}`}
              tabIndex={-1}
            />
          </div>
        )}

        <div className={styles.materialInfo}>
          {!!image && (
            <div className={styles.imageContainer}>
              <Cover src={image} size="fill-width" />
            </div>
          )}
          <div>
            <ConditionalWrapper
              condition={!!title && !!creator && !!id}
              wrapper={(children) => (
                <Link href={getWorkUrl(title, creator, workId)}>
                  {children}
                </Link>
              )}
            >
              <Title
                type="title8"
                as="h3"
                className={styles.materialTitle}
                id={`material-title-${id}`}
              >
                {title}
              </Title>
            </ConditionalWrapper>

            {creator && <Text type="text2">{creator}</Text>}
            {materialType && creationYear && (
              <Text type="text2">
                {materialType}, {creationYear}
              </Text>
            )}
          </div>
        </div>

        <div>{dynamicColumn}</div>

        <div>
          <Text type="text2">{library}</Text>
        </div>

        <div>{renderButton && renderButton}</div>
      </>
    </ConditionalWrapper>
  );
};

MaterialRow.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  creator: PropTypes.string,
  materialType: PropTypes.string,
  creationYear: PropTypes.string,
  library: PropTypes.string.isRequired,
  dynamicColumn: PropTypes.object.isRequired,
  hasCheckbox: PropTypes.bool,
  id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["NONE", "GREEN", "RED"]),
  renderButton: PropTypes.object,
  workId: PropTypes.string,
};

export default MaterialRow;

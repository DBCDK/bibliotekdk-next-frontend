/* eslint-disable css-modules/no-unused-class */
import Cover from "@/components/base/cover";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import ConditionalWrapper from "@/components/base/conditionalwrapper";
import Link from "@/components/base/link";
import cx from "classnames";
import Translate from "@/components/base/translate";
import { getWorkUrlForProfile } from "../../utils";
import sharedStyles from "../MaterialRow.module.css";

const DebtColumn = ({ amount, currency }) => {
  return (
    <div
      className={cx(sharedStyles.dynamicColumn, sharedStyles.isWarning)}
      data-cy="dynamic-column"
    >
      <Text type="text1" tag="span">
        {amount} {currency}
      </Text>
    </div>
  );
};

const MaterialRowDebt = ({
  image,
  title,
  creator,
  materialId,
  workId,
  pid,
  materialType,
  amount,
  currency,
  library,
  dataCy,
  isMobileSize,
}) => {
  if (isMobileSize) {
    return (
      <article
        key={"article" + materialId}
        className={cx(
          sharedStyles.materialRow_mobile,
          sharedStyles.materialRow_debt
        )}
        data-cy={`articleRow-${dataCy}`}
      >
        <div className={sharedStyles.textContainer}>
          <Title type="text1" tag="h3" id={`material-title-${materialId}`}>
            {title}
          </Title>

          {creator && <Text type="text2">{creator}</Text>}
          {materialType && creationYear && (
            <Text type="text2" className={sharedStyles.uppercase}>
              {materialType}, {creationYear}
            </Text>
          )}

          <div className={sharedStyles.dynamicContent}>
            <DebtColumn amount={amount} currency={currency} />
          </div>
          <div>
            <Text type="text2">{library}</Text>
          </div>
        </div>
      </article>
    );
  }
  return (
    <article
      key={"article" + materialId} //to avoid rerendering
      className={cx(
        sharedStyles.materialRow,
        sharedStyles.materialRow_wrapper,
        sharedStyles.debtRow
      )}
      data-cy={`articleRow-${dataCy}`}
    >
      <div className={cx(sharedStyles.materialInfo, sharedStyles.debtMaterial)}>
        {!!image && (
          <div className={sharedStyles.imageContainer}>
            <Cover src={image} size="fill-width" />
          </div>
        )}
        <div className={sharedStyles.textContainer}>
          <ConditionalWrapper
            condition={!!title && !!creator && !!materialId}
            wrapper={(children) => (
              <Link
                border={{
                  top: false,
                  bottom: {
                    keepVisible: true,
                  },
                }}
                href={getWorkUrlForProfile({
                  workId,
                  pid,
                  materialId,
                  materialType,
                })}
                className={sharedStyles.blackUnderline}
              >
                {children}
              </Link>
            )}
          >
            {title ? (
              <Title type="text1" tag="h3" id={`material-title-${materialId}`}>
                {title}
              </Title>
            ) : (
              <Text type="text2">
                {Translate({ context: "profile", label: "unknowMaterial" })}
              </Text>
            )}
          </ConditionalWrapper>

          {creator && (
            <Text type="text2" dataCy="creator">
              {creator}
            </Text>
          )}
          {materialType && (
            <Text
              type="text2"
              className={sharedStyles.uppercase}
              dataCy="materialtype-and-creationyear"
            >
              {materialType} {creationYear && <>, {creationYear}</>}
              {edition && <span>{edition}</span>}
            </Text>
          )}
        </div>
      </div>

      <DebtColumn amount={amount} currency={currency} />

      <div className={cx(sharedStyles.debtLibrary)}>
        <Text type="text2">{library}</Text>
      </div>
    </article>
  );
};

export default MaterialRowDebt;

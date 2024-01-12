/* eslint-disable css-modules/no-unused-class */
import Cover from "@/components/base/cover";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import ConditionalWrapper from "@/components/base/conditionalwrapper";
import Link from "@/components/base/link";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useMutate } from "@/lib/api/api";
import Icon from "@/components/base/icon";
import IconButton from "@/components/base/iconButton";
import ErrorRow from "../../errorRow/ErrorRow";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { useModal } from "@/components/_modal";
import useUser from "@/components/hooks/useUser";
import Translate from "@/components/base/translate";
import { dateToDayInMonth } from "@/utils/datetimeConverter";
import { getWorkUrlForProfile, handleOrderMutationUpdates } from "../../utils";
import { onClickDelete } from "@/components/_modal/pages/deleteOrder/utils";
import sharedStyles from "../MaterialRow.module.css";
import {
  formatMaterialTypesToPresentation,
  formatMaterialTypesToUrl,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";

const OrderColumn = ({ pickUpExpiryDate, holdQueuePosition }) => {
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const pickUpDate = new Date(pickUpExpiryDate);
  const isReadyToPickup = !!pickUpExpiryDate;
  const dateString = isReadyToPickup ? dateToDayInMonth(pickUpDate) : null;
  const inLineText =
    holdQueuePosition === "1"
      ? `${Translate({
          context: "profile",
          label: "front-of-row",
        })}`
      : `${holdQueuePosition - 1} ${Translate({
          context: "profile",
          label: "in-row",
        })}`;

  return (
    <div className={sharedStyles.dynamicColumn} data-cy="dynamic-column">
      <Text type="text2" tag="p">
        {isReadyToPickup && (
          <span>
            {Translate({
              context: "profile",
              label: "pickup-deadline",
            })}{" "}
          </span>
        )}
        {dateString}
      </Text>
      <div>
        <Icon
          className={sharedStyles.ornament}
          size={{ w: 5, h: "auto" }}
          src={"ornament1.svg"}
          alt=""
        />
        <Text
          type={isReadyToPickup || isMobileSize ? "text1" : "text2"}
          tag="p"
          className={cx(sharedStyles.inlineBlock, {
            [sharedStyles.isReady]: isReadyToPickup,
          })}
        >
          {isReadyToPickup
            ? Translate({
                context: "profile",
                label: "ready-to-pickup",
              })
            : inLineText}
        </Text>
      </div>
    </div>
  );
};

const MaterialRowReservation = (props) => {
  const {
    image,
    workId,
    pid,
    materialId,
    flatMaterialTypes,
    title,
    titles,
    creator,
    creators,
    edition,
    creationYear,
    library,
    dataCy,
    isMobileSize,
    removedOrderId,
    pickUpExpiryDate,
    holdQueuePosition,
    //used to delete a reservation / order
    agencyId,
    setRemovedOrderId,
  } = props;
  const status = !!pickUpExpiryDate ? "GREEN" : "NONE";
  const modal = useModal();
  const orderMutation = useMutate();
  const [hasDeleteError, setHasDeleteError] = useState(false);
  const { updateUserStatusInfo } = useUser();

  useEffect(() => {
    handleOrderMutationUpdates(
      orderMutation,
      setHasDeleteError,
      () => setRemovedOrderId(materialId),
      updateUserStatusInfo
    );
  }, [orderMutation.error, orderMutation.data]);

  const onMobileItemClick = () => {
    modal.push("material", {
      label: Translate({
        context: "profile",
        label: "your-order",
      }),
      type: "ORDER",
      setHasDeleteError: setHasDeleteError,
      ...props,
    });
  };

  if (isMobileSize) {
    return (
      <>
        {hasDeleteError && (
          <ErrorRow
            text={Translate({
              context: "profile",
              label: "error-deleting-order",
            })}
          />
        )}
        <article
          className={cx(sharedStyles.materialRow_mobile, {
            [sharedStyles.materialRow_green]: status === "GREEN",
            [sharedStyles.materialRow_red]: status === "RED",
            [sharedStyles.materialRow_mobile_animated]:
              materialId === removedOrderId,
          })}
          role="button"
          onClick={onMobileItemClick}
          tabIndex="0"
          onKeyDown={(e) => {
            e.key === "Enter" && onMobileItemClick();
          }}
          data-cy={`articleRow-${dataCy}`}
        >
          <div>{!!image && <Cover src={image} size="fill-width" />}</div>
          <div className={sharedStyles.textContainer}>
            <Title type="text1" tag="h3" id={`material-title-${materialId}`}>
              {title}
            </Title>

            {creator && <Text type="text2">{creator}</Text>}
            {flatMaterialTypes && creationYear && (
              <Text type="text2" className={sharedStyles.uppercase}>
                {formatMaterialTypesToPresentation(flatMaterialTypes)},{" "}
                {creationYear}
              </Text>
            )}

            <div className={sharedStyles.dynamicContent}>
              <OrderColumn
                pickUpExpiryDate={pickUpExpiryDate}
                holdQueuePosition={holdQueuePosition}
              />
            </div>
          </div>

          <div className={sharedStyles.arrowright_container}>
            <Icon
              alt=""
              size={{ w: "auto", h: 2 }}
              src="arrowrightblue.svg"
              className={sharedStyles.arrowright}
            />
          </div>
        </article>
      </>
    );
  }

  const href = getWorkUrlForProfile({
    workId: workId,
    pid: pid,
    materialTypeAsUrl: formatMaterialTypesToUrl(flatMaterialTypes),
    titles: titles,
    creators: creators,
  });

  const hasWorkUrl = !isEmpty(href);

  return (
    <>
      {hasDeleteError && (
        <ErrorRow
          text={Translate({
            context: "profile",
            label: "error-deleting-order",
          })}
        />
      )}
      <article
        key={"article" + materialId} //to avoid rerendering
        className={cx(
          sharedStyles.materialRow,
          sharedStyles.materialRow_wrapper,
          {
            [sharedStyles.materialRow_green]: status === "GREEN",
            [sharedStyles.materialRow_red]: status === "RED",
            [sharedStyles.materialRow_animated]: materialId === removedOrderId,
          }
        )}
        data-cy={`articleRow-${dataCy}`}
      >
        <div className={sharedStyles.materialInfo}>
          {!!image && (
            <div className={sharedStyles.imageContainer}>
              <Cover src={image} size="fill-width" />
            </div>
          )}
          <div className={sharedStyles.textContainer}>
            <ConditionalWrapper
              condition={!!title && !!materialId}
              wrapper={(children) => (
                <Link
                  border={{
                    top: false,
                    bottom: {
                      keepVisible: true,
                    },
                  }}
                  disabled={!hasWorkUrl}
                  href={href}
                  className={hasWorkUrl ? sharedStyles.blackUnderline : ""}
                >
                  {children}
                </Link>
              )}
            >
              {title ? (
                <Title
                  type="text1"
                  tag="h3"
                  id={`material-title-${materialId}`}
                >
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
            {flatMaterialTypes && (
              <Text
                type="text2"
                className={sharedStyles.uppercase}
                dataCy="materialtype-and-creationyear"
              >
                {formatMaterialTypesToPresentation(flatMaterialTypes)}{" "}
                {creationYear && <>, {creationYear}</>}
                {edition && <span>{edition}</span>}
              </Text>
            )}
          </div>
        </div>
        <div>
          <OrderColumn
            pickUpExpiryDate={pickUpExpiryDate}
            holdQueuePosition={holdQueuePosition}
          />
        </div>

        <div>
          <Text type="text2">{library}</Text>
        </div>

        <div className={sharedStyles.buttonContainer}>
          <IconButton
            dataCy="order-button"
            onClick={() =>
              onClickDelete({
                modal,
                mobile: false,
                pickUpExpiryDate,
                materialId,
                agencyId,
                orderMutation,
                title,
              })
            }
          >
            {Translate({
              context: "profile",
              label: "delete",
            })}
          </IconButton>
        </div>
      </article>
    </>
  );
};

export default MaterialRowReservation;

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ChevronRight from "@/public/icons/chevron_right.svg";
import cx from "classnames";
import localizationStyles from "./Localization.module.css";
import Translate from "@/components/base/translate";

const LocalizationInformation = () => {
  // temp job
  const isLoadingBranches = false;
  const pickupBranch = {
    name: "Branch name",
    postalAddress: "Mellemtoften 9",
    postalCode: "4040",
    city: "Jyllinge"
  };

  const onClick = () => {}

  return (
    <div className={localizationStyles.pickup}>
        <div className={localizationStyles.title}>
          <Title type="title5" tag="h3">
            {Translate({
              context: "order",
              label:"pickup-title",
            })}
          </Title>
        </div>
        <div className={localizationStyles.library}>
          {(isLoadingBranches || pickupBranch) && (
            <Text type="text1" skeleton={!pickupBranch?.name} lines={1}>
              {pickupBranch?.name}
            </Text>
          )}
          <IconLink
            onClick={onClick}
            disabled={isLoadingBranches}
            tag="button"
            iconSrc={ChevronRight}
            iconPlacement={"right"}
            className={cx(localizationStyles.iconLink, {
              [localizationStyles.disabled]: isLoadingBranches,
            })}
            skeleton={isLoadingBranches}
          >
            <Text tag="span" type="text3" className={localizationStyles.fullLink}>
              {Translate({
                context: "order",
                label: "change-pickup-link"
                  /*availableAsDigitalCopy || (!isAuthenticated && isDigitalCopy)
                    ? "change-pickup-digital-copy-link"
                    : pickupBranch
                    ? "change-pickup-link"
                    : "pickup-link",*/
              })}
            </Text>
            <Text tag="span" type="text3" className={localizationStyles.shortLink}>
              {Translate({
                context: "general",
                label: pickupBranch ? "change" : "select",
              })}
            </Text>
          </IconLink>
        </div>
        {(isLoadingBranches || pickupBranch) && (
          <div>
            <Text
              type="text3"
              skeleton={!pickupBranch?.postalAddress}
              lines={2}
            >
              {pickupBranch?.postalAddress}
            </Text>
            <Text
              type="text3"
              skeleton={!pickupBranch?.postalCode || !pickupBranch?.city}
              lines={0}
            >{`${pickupBranch?.postalCode} ${pickupBranch?.city}`}</Text>
          </div>
        )}
      </div>
  );
}

const CheckoutForm = () => {
  return (
    <div>
      <LocalizationInformation />
    </div>
  )
}

export default CheckoutForm;
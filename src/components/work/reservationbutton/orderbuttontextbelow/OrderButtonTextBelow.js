import {
  context,
  getBaseUrl,
  sortEreolFirst,
} from "@/components/work/reservationbutton/utils";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Col from "react-bootstrap/Col";
import styles from "./OrderButtonTextBelow.module.css";
import isEmpty from "lodash/isEmpty";
import Skeleton from "@/components/base/skeleton";
import { AccessEnum } from "@/lib/enums";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";
import { usePeriodica } from "@/components/hooks/order";

/**
 * Set texts BELOW reservation button - also sets the text IN the button
 * For infomedia text is set ABOVE the button ( @see ReservationButton )
 * @param access list of access objects for all editions of same materialtype
 * @param skeleton
 * @returns {React.ReactElement|null}
 */
function OrderButtonTextBelow({
  access,
  skeleton,
  hasPhysicalCopy,
  hasDigitalCopy,
  isPeriodica,
}) {
  const caseScenarioMap = [
    Boolean(access?.[0]?.url),
    Boolean(isPeriodica),
    hasDigitalCopy,
    hasPhysicalCopy,
  ];

  const translationForButtonText = [
    () => {
      return [
        Translate({ ...context, label: "onlineAccessAt" }),
        access?.[0]?.origin || getBaseUrl(access?.[0]?.url),
      ].join(" ");
    },
    () =>
      Translate({
        context: "options",
        label: "periodica-link-description",
      }),
    () => Translate({ ...context, label: "addToCart-line2" }),
    () => Translate({ ...context, label: "addToCart-line1" }),
  ];

  const index = caseScenarioMap.findIndex((caseCheck) => caseCheck);

  return (
    index > -1 &&
    access?.[0]?.id !== null &&
    translationForButtonText?.[index] !== null && (
      <Col xs={12} className={styles.info}>
        <Text
          dataCy={"reservation-button-txt"}
          type="text3"
          skeleton={skeleton}
          lines={2}
        >
          {translationForButtonText?.[index]?.()}
        </Text>
      </Col>
    )
  );
}

export default function Wrap({ selectedPids, skeleton }) {
  const {
    access,
    hasPhysicalCopy,
    hasDigitalCopy,
    isLoading: isLoadingAccess,
  } = useManifestationAccess({
    pids: selectedPids,
  });

  const { isPeriodica, isLoading: isLoadingPeriodica } = usePeriodica({
    pids: selectedPids,
  });

  if (isLoadingAccess || isLoadingPeriodica) {
    return <Skeleton lines={1} className={styles.skeletonstyle} />;
  }

  if (
    isEmpty(access) ||
    access?.[0]?.__typename === AccessEnum.INFOMEDIA_SERVICE
  ) {
    return null;
  }

  const sortedAccess = sortEreolFirst(access);

  return (
    <OrderButtonTextBelow
      access={sortedAccess}
      skeleton={skeleton}
      hasPhysicalCopy={hasPhysicalCopy}
      hasDigitalCopy={hasDigitalCopy}
      isPeriodica={isPeriodica}
    />
  );
}

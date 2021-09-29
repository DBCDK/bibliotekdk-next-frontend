import { useRouter } from "next/router";

import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

import styles from "./Alternatives.module.css";
import { checkRequestButtonIsTrue } from "@/components/work/reservationbutton/ReservationButton";

export function AlternativeOptions({
  onlineAccess = [],
  requestButton = false,
  router = null,
}) {
  const context = { context: "overview" };

  const count = onlineAccess?.length + (requestButton ? 1 : 0);
  {
    return (
      count > 1 && (
        <Link
          border={{ bottom: { keepVisible: true } }}
          onClick={() => {
            if (router) {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  orderPossible: requestButton,
                  modal: "options",
                },
              });
            }
          }}
        >
          <Text>
            {Translate({
              ...context,
              label: "all-options-link",
              vars: [count],
            })}
          </Text>
        </Link>
      )
    );
  }
}

export default function wrap({ selectedMaterial }) {
  const onlineAccess = selectedMaterial?.manifestations?.[0].onlineAccess;
  const manifestations = selectedMaterial?.manifestations;
  const requestButton = checkRequestButtonIsTrue({ manifestations });
  const router = useRouter();

  return (
    <AlternativeOptions
      onlineAccess={onlineAccess}
      requestButton={requestButton}
      router={router}
    />
  );
}

import { useRouter } from "next/router";
import { useModal } from "@/components/_modal";

import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

import styles from "./Alternatives.module.css";
import { checkRequestButtonIsTrue } from "@/components/work/reservationbutton/ReservationButton";

export function AlternativeOptions({
  onlineAccess = [],
  requestButton = false,
  modal = null,
  context = {},
}) {
  // digitalcopy and physical (requestButton) are counted as one
  const count =
    onlineAccess?.filter((entry) => !entry.issn).length +
    (requestButton || onlineAccess?.find((entry) => entry.issn) ? 1 : 0);

  return (
    count > 1 && (
      <Link
        border={{ bottom: { keepVisible: true } }}
        onClick={() =>
          modal.push("options", {
            title: Translate({ context: "modal", label: "title-options" }),
            ...context,
          })
        }
      >
        <Text tag="span">
          {Translate({
            context: "overview",
            label: "all-options-link",
            vars: [count],
          })}
        </Text>
      </Link>
    )
  );
}

export default function wrap({ selectedMaterial }) {
  const onlineAccess = selectedMaterial?.manifestations?.[0].onlineAccess;
  const manifestations = selectedMaterial?.manifestations;
  const requestButton = checkRequestButtonIsTrue({ manifestations });
  const modal = useModal();
  const router = useRouter();

  const { workId, title_author, type, orderPossible } = router.query;

  return (
    <AlternativeOptions
      onlineAccess={onlineAccess}
      requestButton={requestButton}
      modal={modal}
      context={{ workId, title_author, type, orderPossible: requestButton }}
    />
  );
}

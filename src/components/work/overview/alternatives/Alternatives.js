import { useRouter } from "next/router";
import { useModal } from "@/components/_modal";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import { checkRequestButtonIsTrue } from "@/components/work/reservationbutton/utils";

export function AlternativeOptions({ modal = null, fisk = {} }) {
  const { selectedMaterial } = { ...fisk };

  const manifestations = selectedMaterial?.manifestations;
  const requestButton = true;
  const allOnline = [];
  // run through manifestions to get ALL onlineaccess
  manifestations?.forEach((manifestation) => {
    manifestation?.access?.forEach((element) => allOnline.push(element));
  });

  //  filter out duplicates
  let seen = {};
  const onlineAccess = allOnline.filter(function (item) {
    // No duplicate url or issn
    const key = item.url || item.issn;
    if (seen[key]) {
      return false;
    }
    seen[key] = true;
    return true;
  });

  // digitalcopy and physical (orderPossible) are counted as one
  const count =
    onlineAccess?.filter((entry) => !entry.issn).length +
    (requestButton || manifestations?.find((entry) => entry.issn) ? 1 : 0);

  return (
    count > 1 && (
      <Link
        border={{ bottom: { keepVisible: true } }}
        onClick={() =>
          modal.push("options", {
            title: Translate({ context: "modal", label: "title-options" }),
            ...fisk,
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

export default function Wrap({ selectedMaterial }) {
  console.log(selectedMaterial, "SELECTED MATERIAL");

  const modal = useModal();
  const router = useRouter();

  const { workId, title_author, type } = router.query;

  return (
    <AlternativeOptions
      modal={modal}
      fisk={{
        workId,
        title_author,
        type,
        selectedMaterial,
      }}
    />
  );
}

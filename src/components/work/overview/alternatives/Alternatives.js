import { useModal } from "@/components/_modal";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { useData } from "@/lib/api/api";
import { useRouter } from "next/router";
import Skeleton from "@/components/base/skeleton";
import styles from "./Alternatives.module.css";
import Col from "react-bootstrap/Col";
import { accessUtils } from "@/lib/accessFactory";
import { AccessEnum } from "@/lib/enums";
import { useMemo } from "react";

function AlternativeOptions({ modal = null, context = {} }) {
  const { manifestations, type, workId } = { ...context };

  const { allEnrichedAccesses: accesses, requestButtonIsTrue } = useMemo(() => {
    return accessUtils(manifestations);
  }, [manifestations]);

  const requestButton = accesses && requestButtonIsTrue;

  const onlineAccess = accesses?.filter(
    (singleAccess) => singleAccess?.__typename !== AccessEnum.INTER_LIBRARY_LOAN
  );

  // digitalcopy and physical (orderPossible) are counted as one
  const count = (requestButton ? 1 : 0) + onlineAccess?.length;

  if (!(count > 1)) {
    return null;
  }

  return (
    <Col xs={12} className={styles.info}>
      <Link
        border={{ bottom: { keepVisible: true } }}
        onClick={() =>
          modal.push("options", {
            title: Translate({ context: "modal", label: "title-options" }),
            type: type,
            onlineAccess: onlineAccess,
            workId: workId,
            orderPossible: requestButton,
            title_author: context.title_author,
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
    </Col>
  );
}

export default function Wrap({ workId, selectedPids }) {
  const router = useRouter();
  const title_author = router.query.title_author;

  const modal = useModal();

  const { data, isLoading, isSlow } = useData(
    selectedPids &&
      manifestationFragments.alternativesManifestations({ pid: selectedPids })
  );

  const manifestations = data?.manifestations;

  const type = manifestations?.[0]?.materialTypes?.[0]?.specific;

  if (isLoading) {
    return (
      <Skeleton lines={1} className={styles.skeletonstyle} isSlow={isSlow} />
    );
  }

  return (
    <AlternativeOptions
      modal={modal}
      context={{
        workId,
        type,
        manifestations,
        title_author,
      }}
    />
  );
}

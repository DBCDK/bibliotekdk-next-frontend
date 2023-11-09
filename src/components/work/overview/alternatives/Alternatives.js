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
import { accessFactory } from "@/lib/accessFactoryUtils";
import { useMemo } from "react";
import { useBranchUserAndHasDigitalAccess } from "@/components/work/utils";

function AlternativeOptions({ modal = null, hasDigitalAccess, context = {} }) {
  const { manifestations, workId, selectedPids } = { ...context };

  const { getCountOfAllAllowedEnrichedAccessSorted } = useMemo(() => {
    return accessFactory(manifestations);
  }, [manifestations]);

  // INTER_LIBRARY_LOAN and DIGITAL_ARTICLE_SERVICE counted as single access if either is present
  const count = getCountOfAllAllowedEnrichedAccessSorted(hasDigitalAccess);

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
            selectedPids: selectedPids,
            workId: workId,
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

  const { branchIsLoading, hasDigitalAccess } =
    useBranchUserAndHasDigitalAccess();

  const modal = useModal();

  const { data, isLoading, isSlow } = useData(
    selectedPids &&
      manifestationFragments.alternativesManifestations({ pid: selectedPids })
  );

  const manifestations = data?.manifestations;

  if (isLoading || branchIsLoading) {
    return (
      <Skeleton lines={1} className={styles.skeletonstyle} isSlow={isSlow} />
    );
  }

  return (
    <AlternativeOptions
      modal={modal}
      hasDigitalAccess={hasDigitalAccess}
      context={{
        workId,
        manifestations,
        title_author,
        selectedPids,
      }}
    />
  );
}

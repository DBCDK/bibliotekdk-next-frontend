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
import { accessFactory, checkDigitalCopy } from "@/lib/accessFactoryUtils";
import { useMemo } from "react";
import { useBranchUserAndHasDigitalAccess } from "@/components/work/utils";

function AlternativeOptions({ modal = null, hasDigitalAccess, context = {} }) {
  const { manifestations, workId } = { ...context };

  const { getAllAllowedEnrichedAccessSorted } = useMemo(() => {
    return accessFactory(manifestations);
  }, [manifestations]);

  let allowedAccesses = getAllAllowedEnrichedAccessSorted(hasDigitalAccess);

  /**
   * Sort away interlibrary loan if both that and digital access is possible
   * we sort away the interlibrary loan !!
   */
  let key = -1;
  if (hasDigitalAccess && checkDigitalCopy(allowedAccesses)) {
    allowedAccesses.find((access, idx) => {
      if (access.__typename === "InterLibraryLoan") {
        key = idx;
      }
    });

    if (key !== -1) {
      allowedAccesses = allowedAccesses.slice(key, 1);
    }
  }

  // INTER_LIBRARY_LOAN and DIGITAL_ARTICLE_SERVICE each counted as single access
  const count = allowedAccesses?.length;

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
            allowedAccesses: allowedAccesses,
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

  const { branchIsLoading, branchIsSlow, hasDigitalAccess } =
    useBranchUserAndHasDigitalAccess(selectedPids);

  const modal = useModal();

  const { data, isLoading, isSlow } = useData(
    selectedPids &&
      manifestationFragments.alternativesManifestations({ pid: selectedPids })
  );

  const manifestations = data?.manifestations;

  const type = manifestations?.[0]?.materialTypes?.[0]?.specific;

  if (isLoading || branchIsLoading) {
    return (
      <Skeleton
        lines={1}
        className={styles.skeletonstyle}
        isSlow={isSlow || branchIsSlow}
      />
    );
  }

  return (
    <AlternativeOptions
      modal={modal}
      hasDigitalAccess={hasDigitalAccess}
      context={{
        workId,
        type,
        manifestations,
        title_author,
      }}
    />
  );
}

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
import { useMemo } from "react";
import { useBranchUserAndHasDigitalAccess } from "@/components/work/utils";

/**
 * Find and remove a tidsskriftsartikel with interlibraryloan if an artikel
 * can be ordered with digital artikel service
 * @param allowedAccesses
 * @returns {*}
 */
function removePhsicalAccesIfDigital(allowedAccesses) {
  // find all tidsskriftsartikler in given array
  const tidskriftsArtikler = allowedAccesses?.filter(
    (access) => access?.materialTypesArray[0] === "tidsskriftsartikel"
  );

  // check if there are tidsskriftsartikler as BOTH digital AND physical
  if (
    tidskriftsArtikler.find(
      (artikel) => artikel.__typename === "DigitalArticleService"
    ) &&
    tidskriftsArtikler.find(
      (artikel) => artikel.__typename === "InterLibraryLoan"
    )
  ) {
    // get the key to check with
    const tempkey = tidskriftsArtikler.indexOf(
      tidskriftsArtikler.find(
        (artikel) => artikel.__typename === "InterLibraryLoan"
      )
    );
    // find index, in given array, of article to remove
    const key = allowedAccesses.indexOf(
      allowedAccesses.find(
        (access) =>
          access.pid === tidskriftsArtikler[tempkey].pid &&
          access.__typename === "InterLibraryLoan"
      )
    );
    // slice given array
    return allowedAccesses.slice(key, 1);
  }

  // simply return given array
  return allowedAccesses;
}

function AlternativeOptions({ modal = null, hasDigitalAccess, context = {} }) {
  const { manifestations, workId } = { ...context };

  const { getAllAllowedEnrichedAccessSorted } = useMemo(() => {
    return accessUtils(manifestations);
  }, [manifestations]);

  const accesses = getAllAllowedEnrichedAccessSorted(hasDigitalAccess);

  const allowedAccesses = removePhsicalAccesIfDigital(accesses);

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

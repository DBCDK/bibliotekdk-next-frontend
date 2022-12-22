import { useModal } from "@/components/_modal";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useData } from "@/lib/api/api";
import { useRouter } from "next/router";
import Skeleton from "@/components/base/skeleton";
import styles from "./Alternatives.module.css";
import Col from "react-bootstrap/Col";
import { accessUtils } from "@/lib/accessFactory";
import { AccessEnum } from "@/lib/enums";
import { useMemo } from "react";
import useUser from "@/components/hooks/useUser";

function AlternativeOptions({ modal = null, hasDigitalAccess, context = {} }) {
  const { manifestations, workId } = { ...context };

  const { allEnrichedAccesses: accesses } = useMemo(() => {
    return accessUtils(manifestations);
  }, [manifestations]);

  const onlineAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename !== AccessEnum.INTER_LIBRARY_LOAN &&
      singleAccess?.__typename !== AccessEnum.DIGITAL_ARTICLE_SERVICE
  );

  const physicalAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.INTER_LIBRARY_LOAN &&
      singleAccess?.loanIsPossible === true
  );

  const digitalArticleServiceAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE &&
      hasDigitalAccess
  );

  const allowedAccesses = [
    ...onlineAccesses,
    ...physicalAccesses?.slice(0, 1),
    ...digitalArticleServiceAccesses?.slice(0, 1),
  ];

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

  const { loanerInfo } = useUser();

  const {
    data: branchUserData,
    isLoading: branchIsLoading,
    isSlow: branchIsSlow,
  } = useData(
    selectedPids &&
      loanerInfo?.pickupBranch &&
      branchesFragments.branchDigitalCopyAccess({
        branchId: loanerInfo?.pickupBranch,
      })
  );

  const hasDigitalAccess =
    branchUserData?.branches?.result
      ?.map((res) => res.digitalCopyAccess === true)
      .findIndex((res) => res === true) > -1;

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

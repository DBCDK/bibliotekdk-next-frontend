import { useModal } from "@/components/_modal";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Skeleton from "@/components/base/skeleton";
import styles from "./Alternatives.module.css";
import Col from "react-bootstrap/Col";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";

function AlternativeOptions({ modal = null, context = {} }) {
  const { workId, selectedPids, count } = { ...context };

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
  const {
    access,
    isLoading: accessIsLoading,
    isSlow,
  } = useManifestationAccess({
    pids: selectedPids,
  });

  const modal = useModal();

  if (accessIsLoading) {
    return (
      <Skeleton lines={1} className={styles.skeletonstyle} isSlow={isSlow} />
    );
  }

  return (
    <AlternativeOptions
      modal={modal}
      context={{
        workId,
        selectedPids,
        count: access?.length || 0,
      }}
    />
  );
}

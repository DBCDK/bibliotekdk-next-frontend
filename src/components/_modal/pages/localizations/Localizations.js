import Top from "@/components/_modal/pages/base/top";
import styles from "./Localizations.module.css";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Skeleton from "@/components/base/skeleton";

export function Localizations({ context }) {
  console.log(context, "CONTEXT");
  return (
    <div data-cy="localizations-modal" className={styles.wrapper}>
      <Top />
      <div>fisk</div>;
    </div>
  );
}

export default function wrap({ context }) {
  console.log(context, "CONTEXT");
  const { workId } = { ...context };
  console.log(workId, "WORKID");
  // we know there is one or more localizations
  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.localizations({ workId })
  );

  if (isLoading) {
    return <Skeleton lines={15} />;
  }

  const props = { ...context, ...data };

  console.log(data, "DATA");

  return <Localizations context={props} />;
}

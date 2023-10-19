import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";
import { useEffect, useRef, useState } from "react";
import EMaterialAnalyzer from "./EMaterialAnalyzer";
import styles from "./EMaterialFilter.module.css";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

const CONTEXT = "bookmark-order";

/**
 * Step 1 in the multiorder checkout flow
 * Filters all materials which can't be ordered due to it being e-material
 * Skips this step if nothing to filter
 */
const EMaterialFilter = ({ context, active }) => {
  const { materials } = context;
  const analyzeRef = useRef();
  const [materialsToFilter, setMaterialsToFilter] = useState();
  const [materialsToProceed, setMaterialsToProceed] = useState();
  const isLoading = !materialsToFilter || !materialsToProceed;

  useEffect(() => {
    if (!active) return; // Only on open modal
    if (!analyzeRef || !analyzeRef.current) return;
    if (!!materialsToFilter || !!materialsToProceed) return; // Secure only running once

    const elements = [].slice.call(analyzeRef.current.children);
    const toFilter = elements
      .filter(
        (element) =>
          element.getAttribute("data-accessable-ematerial") === "true"
      )
      .map((element) =>
        materials.find(
          (mat) => mat.key === element.getAttribute("data-material-key")
        )
      );
    const toProceed = elements
      .filter(
        (element) =>
          element.getAttribute("data-accessable-ematerial") === "false"
      )
      .map((element) =>
        materials.find(
          (mat) => mat.key === element.getAttribute("data-material-key")
        )
      );

    setMaterialsToFilter(toFilter);
    setMaterialsToProceed(toProceed);
  }, [active, analyzeRef.current]);

  return (
    <section className={styles.eMaterialFilter}>
      <div ref={analyzeRef} className="visually-hidden">
        {/**
         * Workaround since hooks can't be called a dynamic amount of times.
         * This way we render a analyze component for each material & are able to reuse hooks.
         */}
        {materials.map((mat) => (
          <EMaterialAnalyzer material={mat} key={mat.key} />
        ))}
      </div>

      <Top
        title={Translate({
          context: CONTEXT,
          label: "efilter-title",
        })}
        titleTag="h2"
        className={{ top: styles.top }}
      />
      <Title
        skeleton={isLoading}
        titleTag="h3"
        type="title6"
        className={styles.subHeading}
        lines={1}
      >
        <Translate
          context={CONTEXT}
          label={
            materialsToFilter?.length === 1
              ? "efilter-subheading-singular"
              : "efilter-subheading"
          }
          vars={[materialsToFilter?.length]}
        />
      </Title>

      <ul className={styles.filterList}>
        {materialsToFilter?.map((mat) => (
          <li className={styles.filterItem} key={mat.key}>
            <Title titleTag="h4" type="text1">
              {mat.title}
            </Title>
            <Text type="text2">{mat.materialType}</Text>
          </li>
        ))}
      </ul>

      <Text
        skeleton={isLoading}
        className={styles.nextPageDescription}
        lines={1}
      >
        <Translate
          context={CONTEXT}
          label={
            materialsToProceed?.length === 1
              ? "efilter-proceed-text-singular"
              : "efilter-proceed-text"
          }
          vars={[materialsToProceed?.length]}
        />
      </Text>
      <Button type="primary" size="large" skeleton={isLoading}>
        <Translate context={CONTEXT} label="efilter-proceed" />
      </Button>
    </section>
  );
};
export default EMaterialFilter;

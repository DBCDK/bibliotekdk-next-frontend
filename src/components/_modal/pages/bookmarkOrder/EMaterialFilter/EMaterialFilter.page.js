import Text from "@/components/base/text";
import Top from "../../base/top/Top";
import Button from "@/components/base/button";
import { useEffect, useMemo, useRef } from "react";

import EMaterialAnalyzer from "./EMaterialAnalyzer";

/**
 * Step 1 in the multiorder checkout flow
 * Filters all materials which can't be ordered due to it being e-material
 * Skips this step if nothing to filter
 */
const EMaterialFilter = ({ context, active, ...props }) => {
  const analyzeRef = useRef();
  const { materials } = context;

  useEffect(() => {
    if (!active) return;

    
    // analyzeMaterials(materials);
  }, [active, analyzeRef.current]);

  return (
    <section>
      <div ref={analyzeRef}>
      {materials.map((m) => (
        <EMaterialAnalyzer material={m} />
      ))}
      </div>
      
      <Top title={"bemærk"} titleTag="h2" />
      <Text>x materialer findes online, og kræver ikke bestilling</Text>
      *list
      <Text>På næste side vises de x materialer, som du kan bestille</Text>
      <Button type="primary" size="large">
        Næste
      </Button>
    </section>
  );
};
export default EMaterialFilter;

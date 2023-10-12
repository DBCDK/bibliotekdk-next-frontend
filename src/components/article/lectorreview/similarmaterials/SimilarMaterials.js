/**
 * @file SimilarMaterials handles the slider for similarMaterials for the LectorReviewPage
 */

import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import ScrollSnapSlider from "@/components/base/scrollsnapslider/ScrollSnapSlider";
import * as PropTypes from "prop-types";
import uniqWith from "lodash/uniqWith";

/**
 * SimilarMaterial render the Materials mentioned in a lectorReview.
 * Important props:
 * @param similarMaterials The similar materials found in the actual lectorReviews
 * @param sliderId is used by the ScrollSnapSlider. We pass it in case we need specials handling of the scrolling
 * @returns {React.JSX.Element}
 */
export function SimilarMaterials({
  similarMaterials,
  sliderId = "lector_review_page__section__slider",
}) {
  const { flattenedGroupedSortedManifestations: manifestations } =
    manifestationMaterialTypeFactory(similarMaterials);

  const renderingSimilarMaterials = uniqWith(
    manifestations,
    (a, b) => a.pid === b.pid
  ).map((similarMaterial, index) => {
    return (
      <MaterialCard
        key={JSON.stringify(similarMaterial) + index}
        propAndChildrenInput={similarMaterial}
      />
    );
  });

  return (
    <Section
      title={Translate({ context: "reviews", label: "similar_materials-2" })}
      space={{ bottom: "var(--pt0)", top: "var(--pt4)" }}
      backgroundColor="var(--parchment)"
    >
      <ScrollSnapSlider sliderId={sliderId}>
        {renderingSimilarMaterials}
      </ScrollSnapSlider>
    </Section>
  );
}
SimilarMaterials.propTypes = {
  similarMaterials: PropTypes.arrayOf(PropTypes.object),
  sliderId: PropTypes.string,
};

/**
 * @file LectorReviewPage presents the lector reviews for the users
 */

import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import isEmpty from "lodash/isEmpty";
import * as PropTypes from "prop-types";
import { ReviewHeading } from "@/components/article/lectorreview/reviewheading/ReviewHeading";
import { ReviewInformation } from "@/components/article/lectorreview/reviewinformation/ReviewInformation";
import { ReviewContent } from "@/components/article/lectorreview/reviewcontent/ReviewContent";
import { SimilarMaterials } from "@/components/article/lectorreview/similarmaterials/SimilarMaterials";

/**
 * LectorReviewPage displays the reviewByLibrarians.
 *  The {@link review} param is the manifestation of the actual review.
 *  It contains 3 important parts:
 *  - Its own details
 *  - review -> reviewByLibrarian
 *  - relations -> isReviewOf
 * @param review
 * @returns {React.JSX.Element}
 */
export function LectorReviewPage({ review }) {
  const router = useRouter();

  const lectorReviews = review.review.reviewByLibrarians;

  const reviewedManifestation =
    review?.relations?.isReviewOf?.find(
      (manifestation) => manifestation?.cover?.origin !== "default"
    ) || review?.relations?.isReviewOf?.[0];

  const similarMaterials = lectorReviews.flatMap(
    (reviewParts) => reviewParts?.manifestations
  );

  console.log("REVIEW", review);

  return (
    <>
      <Header router={router} />
      <ReviewHeading propAndChildrenInput={reviewedManifestation} />
      <ReviewInformation
        creationDate={review?.recordCreationDate}
        reviewCreators={review?.creators
          ?.map((creator) => creator.display)
          .join(", ")}
      />
      <ReviewContent lectorReviews={lectorReviews} />
      {!isEmpty(similarMaterials) && (
        <SimilarMaterials similarMaterials={similarMaterials} />
      )}
    </>
  );
}

LectorReviewPage.propTypes = {
  review: PropTypes.object,
};

export default LectorReviewPage;

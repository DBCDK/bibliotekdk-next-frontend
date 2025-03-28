import PropTypes from "prop-types";
import Recommendations from "../recommendations";
import Overview from "../overview";
import Details from "../details";
import Description from "../description";
import RelatedWorks from "../relatedworks";
import Content from "../content";
import Keywords from "../keywords";
import SimilarArticles from "../similararticles";
import Related from "../related";
import Reviews from "../reviews";
import BibliographicData from "../bibliographicdata";
import Series from "../series";
import Header from "@/components/header/Header";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Translate from "@/components/base/translate";
import Parts from "../parts";

import Anchor from "@/components/base/anchor";
import min from "lodash/min";
import { AnchorsEnum } from "@/lib/enums";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Custom404 from "@/pages/404";
import Universes from "@/components/work/universes/Universes";
import PeriodicaArticles from "@/components/work/periodicaArticles/PeriodicaArticles";
import Issues from "@/components/work/periodicaArticles/Issues";
import PeriodicaOverview from "../periodicaoverview/PeriodicaOverview";

/**
 * The work page React component
 *
 * See propTypes for specific props and types
 *
 * @param {string} workId
 * @param {function} onTypeChange
 * @param {function} login
 * @param {SpecificDisplayArray} type
 * @returns {React.JSX.Element}
 */
export default function WorkPage({ workId, onTypeChange, login, type }) {
  const router = useRouter();
  const mainRef = useRef();
  const [containerWidth, setContainerWidth] = useState();
  const fbiWork = useData(workFragments.overviewWork({ workId }));

  useEffect(() => {
    // TODO: Make a more elegant solution, when someone has an idea.
    //  We need to be able to tap into the width of the container
    function setContainerWidthCssProp() {
      // 1400 is the container's fullscreen default width
      const widthBeforeMin = min([mainRef.current.clientWidth, 1400]);
      setContainerWidth(widthBeforeMin);
    }

    if (mainRef?.current) {
      setContainerWidthCssProp();
      window.addEventListener("resize", setContainerWidthCssProp);
      return () => {
        window.removeEventListener("resize", setContainerWidthCssProp);
      };
    }
  }, [workId, login, type]);

  if (!fbiWork.isLoading && fbiWork.data.work === null) {
    return <Custom404 />;
  }

  return (
    <>
      <Header router={router} />
      <main
        ref={mainRef}
        {...(containerWidth && {
          style: {
            "--container_width": `${containerWidth}px`,
          },
        })}
      >
        <Anchor.Wrap>
          <Overview
            workId={workId}
            onTypeChange={onTypeChange}
            login={login}
            type={type}
            anchor-label={Translate({ context: "workmenu", label: "loan" })}
          />

          <Anchor.Menu />
          <Details
            workId={workId}
            type={type}
            anchor-label={Translate({ context: "details", label: "title" })}
          />
          <Description
            workId={workId}
            type={type}
            anchor-label={Translate({ context: "description", label: "title" })}
          />

          <Parts
            workId={workId}
            type={type}
            anchor-label={Translate({
              context: "bibliographic-data",
              label: "manifestationParts",
            })}
          />
          <RelatedWorks
            workId={workId}
            type={type}
            anchor-label={Translate(AnchorsEnum.RELATED_WORKS)}
          />
          <Content
            workId={workId}
            type={type}
            anchor-label={Translate({ context: "content", label: "title" })}
          />
          <section
            anchor-label={Translate({ context: "keywords", label: "title" })}
          >
            <Keywords workId={workId} />
            <Related workId={workId} />
          </section>

          <PeriodicaOverview
            anchor-label={Translate({
              context: "periodica",
              label: "periodicaOverviewTitle",
            })}
            workId={workId}
          />

          <PeriodicaArticles
            workId={workId}
            anchor-label={Translate({ context: "periodica", label: "title" })}
          />

          <SimilarArticles
            workId={workId}
            anchor-label={Translate({
              context: "similararticles",
              label: "unspecificTitle",
            })}
          />

          <Issues
            workId={workId}
            anchor-label={Translate({
              context: "periodica",
              label: "title",
            })}
          />

          {/* TODO: WorkGroupingsOverview.js refererer til dennes oversættelse */}
          <section anchor-label={Translate(AnchorsEnum.SERIES)}>
            <Series workId={workId} />
          </section>
          <Recommendations
            workId={workId}
            anchor-label={Translate({
              context: "recommendations",
              label: "remindsOf",
            })}
          />
          <section anchor-label={Translate(AnchorsEnum.UNIVERSES)}>
            <Universes workId={workId} />
          </section>
          <Reviews
            workId={workId}
            anchor-label={Translate({ context: "workmenu", label: "reviews" })}
          />
          <BibliographicData
            workId={workId}
            anchor-label={Translate({ context: "workmenu", label: "editions" })}
          />
        </Anchor.Wrap>
      </main>
    </>
  );
}

WorkPage.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  onTypeChange: PropTypes.func,
};

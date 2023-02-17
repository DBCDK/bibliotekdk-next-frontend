import PropTypes from "prop-types";
import Recommendations from "../recommendations";
import Overview from "../overview";
import Details from "../details";
import Description from "../description";
/*
 * TODO: Insert below when relatedWorks has been approved
 * import RelatedWorks from "../relatedworks";
 */
import Content from "../content";
import Keywords from "../keywords";
import Related from "../related";
import Reviews from "../reviews";
import BibliographicData from "../BibliographicData";
import Series from "../series";
import Header from "@/components/header/Header";
import React from "react";
import { useRouter } from "next/router";
import Translate from "@/components/base/translate";

import Anchor from "@/components/base/anchor";

/**
 * The work page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function WorkPage({ workId, onTypeChange, login, type }) {
  const router = useRouter();

  return (
    <main>
      <Header router={router} />
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
        {/* TODO: Insert below when relatedWorks has been approved */}
        {/*<RelatedWorks*/}
        {/*  workId={workId}*/}
        {/*  type={type}*/}
        {/*  anchor-label={Translate({ context: "relatedworks", label: "title" })}*/}
        {/*/>*/}
        <Content
          workId={workId}
          type={type}
          anchor-label={Translate({ context: "content", label: "title" })}
        />
        <div
          type={type}
          anchor-label={Translate({ context: "keywords", label: "title" })}
        >
          <Keywords workId={workId} />
          <Related workId={workId} />
        </div>
        <Series
          workId={workId}
          anchor-label={Translate({ context: "workmenu", label: "series" })}
        />
        <Recommendations
          workId={workId}
          anchor-label={Translate({
            context: "recommendations",
            label: "remindsOf",
          })}
        />
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
  );
}

WorkPage.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  onTypeChange: PropTypes.func,
};

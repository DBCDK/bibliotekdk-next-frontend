import PropTypes from "prop-types";
import Recommendations from "../recommendations";
import Content from "../content";
import Description from "../description";
import Details from "../details";
import Overview from "../overview";
import Keywords from "../keywords";
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
 * @returns {component}
 */
export default function WorkPage({
  workId,
  onTypeChange,
  onOnlineAccess,
  type = "Bog",
}) {
  const router = useRouter();
  return (
    <main>
      <Header router={router} />
      <Anchor.Wrap>
        <Overview
          workId={workId}
          onTypeChange={onTypeChange}
          onOnlineAccess={onOnlineAccess}
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
        <Content
          workId={workId}
          type={type}
          anchor-label={Translate({ context: "content", label: "title" })}
        />
        <Keywords
          workId={workId}
          type={type}
          anchor-label={Translate({ context: "keywords", label: "title" })}
        />
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
  type: PropTypes.string,
  onTypeChange: PropTypes.func,
  onOnlineAccess: PropTypes.func,
};

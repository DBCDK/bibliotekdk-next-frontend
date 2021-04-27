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
  const context = { context: "workmenu" };
  return (
    <main>
      <Header router={router} />
      <Anchor.Wrap>
        <Overview
          workId={workId}
          onTypeChange={onTypeChange}
          onOnlineAccess={onOnlineAccess}
          type={type}
          anchor-label={Translate({ ...context, label: "loan" })}
        />
        <Anchor.Menu />
        <Details
          workId={workId}
          type={type}
          anchor-label={Translate({ ...context, label: "details" })}
        />
        <Description
          workId={workId}
          type={type}
          anchor-label={Translate({ ...context, label: "description" })}
        />
        <Content
          workId={workId}
          type={type}
          anchor-label={Translate({ ...context, label: "content" })}
        />
        <Series
          workId={workId}
          anchor-label={Translate({ ...context, label: "series" })}
        />
        <Recommendations
          workId={workId}
          anchor-label={Translate({ ...context, label: "reminds-of" })}
        />
        <Keywords
          workId={workId}
          type={type}
          anchor-label={Translate({ ...context, label: "keywords" })}
        />
        <Reviews
          workId={workId}
          anchor-label={Translate({ ...context, label: "reviews" })}
        />
        <BibliographicData
          workId={workId}
          anchor-label={Translate({ ...context, label: "editions" })}
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

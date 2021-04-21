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
          anchor-label="Lån"
        />
        <Anchor.Menu />
        <Details workId={workId} type={type} anchor-label="Detaljer" />
        <Description workId={workId} type={type} anchor-label="Beskrivelse" />
        <Content workId={workId} type={type} anchor-label="Indhold" />
        <Series workId={workId} anchor-label="Serie" />
        <Recommendations workId={workId} anchor-label="Minder om" />
        <Keywords workId={workId} type={type} anchor-label="Emneord" />
        <Reviews workId={workId} anchor-label="Anmeldelser" />
        <BibliographicData workId={workId} anchor-label="Udgaver" />
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

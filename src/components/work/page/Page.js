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

/**
 * The work page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function WorkPage({ workId, onTypeChange, type = "Bog" }) {
  const router = useRouter();
  return (
    <main>
      <Header router={router} />
      <Overview workId={workId} onTypeChange={onTypeChange} type={type} />
      <Details workId={workId} type={type} />
      <Description workId={workId} type={type} />
      <Content workId={workId} type={type} />
      <Series workId={workId} />
      <Recommendations workId={workId} />
      <Keywords workId={workId} type={type} />
      <Reviews workId={workId} />
      <BibliographicData workId={workId} />
    </main>
  );
}

WorkPage.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  onTypeChange: PropTypes.func,
};

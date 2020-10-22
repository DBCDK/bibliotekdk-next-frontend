import BibliographicData from "./BibliographicData";
import React, { useState } from "react";

export default {
  title: "Work: Bibliographic data",
};

/**
 * Returns bibliographic data component
 */
export function BibData() {
  return <BibliographicData workId={"some-id"} />;
}

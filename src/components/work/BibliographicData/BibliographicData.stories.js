import { GetBibData } from "./BibliographicData";
import React, { useState } from "react";

export default {
  title: "Work: Bibliographic data",
};

/**
 * Returns bibliographic data component
 */
export function BibData() {
  return <GetBibData workId={"some-id"} />;
}

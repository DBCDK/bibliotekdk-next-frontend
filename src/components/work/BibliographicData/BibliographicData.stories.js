import { BibliographicData } from "./BibliographicData";
import React, { useState } from "react";
import dummy_workDataApi from "../dummy.workDataApi";
import dummy_materialTypesApi from "../dummy.materialTypesApi";

export default {
  title: "Work: Bibliographic data",
};

/**
 * Returns bibliographic data component
 */
export function BibData() {
  const workId = "some-id";
  const data = dummy_workDataApi({
    workId,
  }).work.materialTypes.map(
    (entry) =>
      dummy_materialTypesApi({ workId, type: entry.materialType })[workId]
  );

  return <BibliographicData data={data} />;
}

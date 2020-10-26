"use strict";

import dummy_materialTypesApi from "../dummy.materialTypesApi";
import React from "react";

// fields to handle - add to handle a field eg. subjects or lix or let or ...
// @TODO it would be nice if fields are shown in the order here .. fix it
const fields = [
  "contribution",
  "description",
  "lang",
  //"notes",
  "pages",
  "pid",
  "released",
];

/**
 * @param manifestation
 *  The work to parse. For now it holds {pid, materialtype, cover}
 * @constructor
 */
let ManifestationParserObject = function (manifestation) {
  this._manifestation = manifestation;
  this._fields = ManifestationParserObject.flipArray(fields);
};

// public methods
ManifestationParserObject.prototype = {
  /**
   * Parse manifestation in two columns
   * @returns {*[]|*[]}
   *  object with an array for each column
   */
  parseManifestationInTwoColumns: function () {
    // @TODO get real data from api
    let dataToParse = this._getDummyData();
    let twoColumnsArray = this._splitInColumns(dataToParse);
    return twoColumnsArray;
  },

  /**
   * Private function
   * get additional data for objects manifestatio. n
   * @returns {[]}
   * @private
   */
  _getDummyData: function () {
    let props = { workId: "workId", type: this._manifestation.materialType };
    let data = dummy_materialTypesApi(props);
    let dataArray = {};
    for (let [key, value] of Object.entries(data.workId)) {
      if (!this._fields[key]) {
        continue;
      }
      let element = [];
      // make sure we return an array for easier parsing
      if (!Array.isArray(value)) {
        value = [value];
      }
      dataArray[key] = value;
    }
    return dataArray;
  },
  /**
   * Private function
   * Split given data in two arrays for two columns in ui
   * for now 2 columns are hardcoded .. maybe it is a good idea
   * to have as a variable ..
   * @param dataArray
   * @returns {[]|*[]}
   * @private
   */
  _splitInColumns: function (dataArray) {
    if (!Object.keys(dataArray).length) {
      return [];
    }
    // we need to iterate data to count actual entries
    let linecount = 0;
    for (let [key, value] of Object.entries(dataArray)) {
      linecount += value.length;
    }
    // the length of first column
    let colLength = (linecount / 2) >> 0;
    // holder for the two columns
    let arrayInColumns = [];
    // element in a column
    let element = [];
    // how far are we
    let columnCount = 0;
    // array with the two columns to return
    let columnArray = [];
    // flag - is column 1 done
    let columOneDone = false;
    // iterate again to split into two columns
    for (let [key, value] of Object.entries(dataArray)) {
      // reset element
      element = [];
      columnCount += value.length;
      if (columnCount > colLength && !columOneDone) {
        columOneDone = true;
        // we added half of the fields - reset and do column 2
        arrayInColumns["col1"] = columnArray;
        columnArray = [];
      }
      element[key] = value;
      columnArray.push(element);
    }
    arrayInColumns["col2"] = columnArray;

    return arrayInColumns;
  },
};

/**
 * reverse key -> value of an array eg. [0:"fisk"] => ["fisk":0]
 * @param arrayToFlip
 * @returns {{[p: string]: *}}
 */
ManifestationParserObject.flipArray = function (arrayToFlip) {
  const flipped = Object.entries(arrayToFlip).reduce(
    (obj, [key, value]) => ({ ...obj, [value]: key }),
    {}
  );
  return flipped;
};

export default ManifestationParserObject;

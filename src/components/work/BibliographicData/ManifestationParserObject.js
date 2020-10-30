"use strict";

import dummy_materialTypesApi from "../dummy.materialTypesApi";
import React from "react";

// fields to handle - add to handle a field eg. subjects or lix or let or ...
// @TODO it would be nice if fields are shown in the order here .. fix it
const fields = [
  "contribution",
  "description",
  "language",
  //"notes",
  "physicalDescription",
  "pid",
  "datePublished",
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
    // we need to iterate data to count actual entries (content)
    let linecount = 1;
    for (let [key, value] of Object.entries(dataArray)) {
      linecount += value.length;
    }
    // the length of first column (half of content)
    let colLength = (linecount / 2) >> 0;
    // holder for the two columns
    let arrayInColumns = [];
    // element in a column
    let element = [];
    // how far are we
    let columnCount = 0;
    // array with a column to return
    let columnArray = [];
    // flag - is column 1 done
    let columOneDone = false;
    // iterate again to split into two columns
    let last = null;
    for (let [key, value] of Object.entries(dataArray)) {
      // reset element
      element = [];
      // make a new element
      element[key] = value;
      // push to return array
      columnArray.push(element);
      // increase counter with length of array
      columnCount += value.length;
      // check if column one holds more than half of content
      if (columnCount > colLength && !columOneDone) {
        columOneDone = true;
        if (columnArray.length > 1) {
          // except the last added element - we want that in column 2
          last = columnArray.pop();
        } else {
          last = null;
        }
        // we added half of the fields - reset to do column 2
        arrayInColumns["col1"] = columnArray;
        columnArray = [];
        if (last) {
          columnArray.push(last);
        }
      }
    }
    // push second column to return array
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

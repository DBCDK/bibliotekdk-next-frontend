"use strict";

import dummy_materialTypesApi from "../dummy.materialTypesApi";
import Text from "../../base/text/Text";
import React from "react";

const fields = [
  "contribution",
  "description",
  "lang",
  "notes",
  "pages",
  "pid",
  "released",
];

// constructor
let ManifestationParserObject = function (manifestation) {
  this._manifestation = manifestation;
  this._fields = ManifestationParserObject.flipArray(fields);
};

// public methods
// can be called after initializing an object
ManifestationParserObject.prototype = {
  parseManifestation: function () {
    // @TODO get real data from api
    let dataToParse = this._getDummyData();
    let twoColumnsArray = this._splitInColumns(dataToParse);
    return twoColumnsArray;
  },

  /**
   * Private function
   * get additional data for objects manifestation
   * @returns {[]}
   * @private
   */
  _getDummyData: function () {
    let props = { workId: "workId", type: this._manifestation.materialType };
    let data = dummy_materialTypesApi(props);
    let dataArray = {};
    let element = [];
    for (let [key, value] of Object.entries(data.workId)) {
      if (this._fields[key]) {
        let element = [];
        // make sure we return an array for easier parsing
        if (!Array.isArray(value)) {
          value = [value];
        }
        element[key] = value;
        dataArray[key] = value;
        //dataArray = [...dataArray, element];
      }
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
    if (!dataArray) {
      return [];
    }

    // we need to iterate data to know how count actual entries
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
    // iterate again to split into two columns
    for (let [key, value] of Object.entries(dataArray)) {
      // reset element
      element = [];
      columnCount += value.length;
      if (columnCount > colLength) {
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

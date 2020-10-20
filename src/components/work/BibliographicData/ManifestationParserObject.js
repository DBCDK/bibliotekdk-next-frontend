"use strict";

import dummy_materialTypesApi from "../dummy.materialTypesApi";

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
let ManifestationParserObject = function ({ manifestation }) {
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
    let dataArray = [];
    let element = [];
    for (let [key, value] of Object.entries(data.workId)) {
      if (this._fields[key]) {
        let element = [];
        // make sure we return an array for easier parsing
        if (!Array.isArray(value)) {
          value = [value];
        }
        element[key] = value;
        dataArray = [...dataArray, element];
      }
    }
    return dataArray;
  },

  /**
   * Private function
   * Split given data in two arrays for two columns in ui
   * @param dataArray
   * @returns {[]|*[]}
   * @private
   */
  _splitInColumns: function (dataArray) {
    if (!dataArray) {
      return [];
    }

    let divider = dataArray.length;
    let colLength = (divider / 2) >> 0;
    let arrayInColumns = [];

    arrayInColumns["col1"] = dataArray.slice(0, colLength);
    arrayInColumns["col2"] = dataArray.slice(colLength, dataArray.length);

    return arrayInColumns;
  },
};

// static functions
// can be called from anywhere
ManifestationParserObject.hest = function () {
  console.log("hest");
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

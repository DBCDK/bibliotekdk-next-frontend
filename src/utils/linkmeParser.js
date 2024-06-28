/**
 * @file linkmeParser.js
 * To support old permalinks we try to parse into something we can understand.
 *
 * examples:
 * linkme.php?cql=ti%3D%22vandpest%22 -> linkme?ti=vandpest
 * linkme.php?ccl=fo%3Dholm%20og%20ti%3Dkina%20fra%20kejserd%C3%B8mme -> linkme?fo=holm&ti=kina+fra+kejserdømme
 */

/**
 * Function to transform url from linkme.php.js into something that linkm.js can understand
 * @param linkme
 *  the ccl OR cql part of the query
 */
export function linkmeParser(linkme) {
  // look for 8 or 9 digits - probably a faust
  let regexp = /^(\d{8}|\d{9})$/;
  // linkme.php?ccl=12345678 (faust)
  if (linkme.match(regexp)) {
    return `faust.id=${linkme}`;
  }
  // look for 10 or 12 digits - probably an isbn
  regexp = /^(\d{10}|\d{12})$/;
  // linkme.php?ccl=1234567890 (isbn)
  if (linkme.match(regexp)) {
    return `isbn.id=${linkme}`;
  }

  // look for a pid eg. 123456-basis:12345678
  regexp = /^([0-9]+-[A-Za-z]+:[0-9]+)$/i;
  if (linkme.match(regexp)) {
    return `rec.id=${linkme}`;
  }

  // the next part handles searches :)
  // const queryParameters = linkme.split(" og ");
  // const query = [];
  // regexp =
  //   /^([A-Z.]+)=((?:[\p{L}0-9,_\-–*;:'+.?$()]+\s,?)*[\p{L}0-9,_–*;:\-'+.?$()]+)/iu;
  // queryParameters.forEach((param) => {
  //   const groups = param.match(regexp);
  // });
  // return "fisk";
}

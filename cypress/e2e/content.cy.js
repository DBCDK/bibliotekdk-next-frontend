const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

const expected = [
  {
    tag: "div",
    aria: {},
    text: "Seneste udgave, musik (cd)",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 0,
      y: 0,
      width: 360,
      height: 91,
    },
  },
  {
    tag: "hr",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 16,
      y: 0,
      width: 164,
      height: 1,
    },
  },
  {
    tag: "h2",
    aria: {
      "aria-expanded": "true",
    },
    text: "Indhold",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_serifmedium",
      fontSize: "24px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 17,
      width: 328,
      height: 32,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(242, 242, 242)",
    },
    box: {
      x: 0,
      y: 91,
      width: 360,
      height: 52,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Libra : version for 10-strenget guitar",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 97,
      width: 242,
      height: 18,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Per Nørgård (f. 1932)",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 97,
      width: 327,
      height: 40,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Genkomster",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 149,
      width: 81,
      height: 18,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Per Nørgård (f. 1932)",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 105,
      y: 149,
      width: 137,
      height: 18,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(242, 242, 242)",
    },
    box: {
      x: 0,
      y: 173,
      width: 360,
      height: 52,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Papalagi : minutmusik version a",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 179,
      width: 213,
      height: 18,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Per Nørgård (f. 1932)",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 179,
      width: 315,
      height: 40,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Papalagi : minutmusik version b",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 231,
      width: 213,
      height: 18,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Per Nørgård (f. 1932)",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 231,
      width: 315,
      height: 40,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(242, 242, 242)",
    },
    box: {
      x: 0,
      y: 277,
      width: 360,
      height: 30,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Morgenstund",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 283,
      width: 87,
      height: 18,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Per Nørgård (f. 1932)",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 111,
      y: 283,
      width: 137,
      height: 18,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 307,
      width: 1,
      height: 30,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 322,
      width: 8,
      height: 1,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Lysnen",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 40,
      y: 313,
      width: 46,
      height: 18,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(242, 242, 242)",
    },
    box: {
      x: 0,
      y: 337,
      width: 360,
      height: 30,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 337,
      width: 1,
      height: 30,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 352,
      width: 8,
      height: 1,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Lytten",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 40,
      y: 343,
      width: 42,
      height: 18,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 367,
      width: 1,
      height: 30,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 382,
      width: 8,
      height: 1,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Endnu mild af søvn",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 40,
      y: 373,
      width: 127,
      height: 18,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(242, 242, 242)",
    },
    box: {
      x: 0,
      y: 397,
      width: 360,
      height: 30,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 397,
      width: 1,
      height: 30,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 412,
      width: 8,
      height: 1,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: "Opvågnen",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 40,
      y: 403,
      width: 67,
      height: 18,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 427,
      width: 1,
      height: 52,
    },
  },
  {
    tag: "div",
    aria: {},
    text: "",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgb(214, 214, 215)",
    },
    box: {
      x: 24,
      y: 453,
      width: 8,
      height: 1,
    },
  },
  {
    tag: "p",
    aria: {
      "aria-expanded": "true",
    },
    text: 'Scherzo depressivo ("En ny dag truer, Søren Brun!")',
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sanssemibold",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 40,
      y: 433,
      width: 292,
      height: 40,
    },
  },
  {
    tag: "span",
    aria: {
      "aria-expanded": "true",
    },
    text: "Se alle",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 16,
      y: 489,
      width: 74,
      height: 18,
    },
  },
  {
    tag: "span",
    aria: {},
    text: "( 39 )",
    styles: {
      borderTopWidth: "0px",
      borderRightWidth: "0px",
      borderBottomWidth: "0px",
      borderLeftWidth: "0px",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
      borderLeftStyle: "none",
      borderTopColor: "rgb(33, 33, 33)",
      borderRightColor: "rgb(33, 33, 33)",
      borderBottomColor: "rgb(33, 33, 33)",
      borderLeftColor: "rgb(33, 33, 33)",
      fontFamily: "ibm_plex_sansregular",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgb(33, 33, 33)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    box: {
      x: 63,
      y: 489,
      width: 27,
      height: 18,
    },
  },
];

describe("Content", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit(
      `${nextjsBaseUrl}/materiale/tales-from-the-north_per-noergaard-f-1932-/work-of:870970-basis:27634427`
    );
    cy.consentAllowAll();
    cy.get("[data-cy=anchor-menu-items]").invoke("css", "display", "none");
    cy.get("[data-cy=feedback-wrapper]").invoke("css", "display", "none");

    cy.contains("Seneste udgave, musik");
  });

  it(`Section with content is correctly rendered - Desktop`, () => {
    cy.contains("version for 10")
      .parents('[data-cy="section"]')
      .matchImageSnapshot({
        maxDiffThreshold: 0.00001,
      });
  });

  it.only(`Section with content is correctly rendered - Mobile`, () => {
    cy.viewport(375, 812);

    cy.contains("version for 10")
      .parents('[data-cy="section"]')
      .first()
      .then(($el) => {
        const json = serializeVisibleDom($el[0]);
        const filtered = json.filter(
          (item) =>
            item.text || item.styles.backgroundColor !== "rgba(0, 0, 0, 0)"
        );

        assertDomListDeepEqual(filtered, expected, $el[0]);
        // drawOverlay($el[0], filtered);
        // filtered.forEach((item, idx) => {
        //   cy.wrap(stripUndefined(item)).should(
        //     "deep.equal",
        //     stripUndefined(expected[idx])
        //   );
        // });
      });

    // cy.contains("version for 10")
    //   .parents('[data-cy="section"]')
    //   .matchImageSnapshot({
    //     maxDiffThreshold: 0.00001,
    //   });

    // cy.screenshot("mobile", { capture: "runner" });
    // cy.matchImage({ forceDeviceScaleFactor: false });
  });

  it(`Modal with full content is correctly rendered`, () => {
    cy.wait(1000);
    cy.contains("version for 10")
      .parents('[data-cy="section"]')
      .contains("Se alle")
      .click();
    cy.wait(1000);

    cy.get(".modal_container").then(($el) => {
      const json = serializeVisibleDom($el[0]);
      console.log("json", json);
    });
  });
});

function serializeVisibleDom(rootEl) {
  const pick = (obj, keys) =>
    keys.reduce((acc, k) => {
      acc[k] = obj[k];
      return acc;
    }, {});

  const styleKeys = [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderTopStyle",
    "borderRightStyle",
    "borderBottomStyle",
    "borderLeftStyle",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "color",
    "backgroundColor",
  ];

  function getText(el) {
    return Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => (n.textContent || "").replace(/\s+/g, " ").trim())
      .join(" ")
      .trim();
  }

  function isVisible(el, rect) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (rect.width === 0 || rect.height === 0) return false;
    return true;
  }

  const rootRect = rootEl.getBoundingClientRect();
  const result = [];

  function collect(el) {
    if (el.classList.contains("__dom_overlay__")) return;

    const rect = el.getBoundingClientRect();
    if (!isVisible(el, rect)) return;

    const style = getComputedStyle(el);
    const box = {
      x: Math.round(rect.x - rootRect.x),
      y: Math.round(rect.y - rootRect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };

    result.push({
      tag: el.tagName.toLowerCase(),
      testid: el.getAttribute("data-testid") || undefined,
      role: el.getAttribute("role") || undefined,
      aria: Array.from(el.attributes)
        .filter((a) => a.name.startsWith("aria-"))
        .reduce((acc, a) => {
          acc[a.name] = a.value;
          return acc;
        }, {}),
      text: getText(el),
      styles: pick(style, styleKeys),
      box,
    });

    for (const child of el.children) {
      collect(child);
    }
  }

  collect(rootEl);
  return result;
}
// ---------- utils ----------
function stripUndefined(value) {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)])
    );
  }
  return value;
}

function diffObjectFields(a, e) {
  // Sammenlign felter vi går op i: tag, testid, role, aria, text, styles, box
  const diffs = {};
  const add = (k, va, ve) => {
    if (!Cypress._.isEqual(va, ve)) diffs[k] = { actual: va, expected: ve };
  };

  add("tag", a?.tag, e?.tag);
  add("testid", a?.testid, e?.testid);
  add("role", a?.role, e?.role);
  add("aria", a?.aria, e?.aria);

  // Vis kun tekst-diff, hvis tekst er forskellig
  if (!Cypress._.isEqual(a?.text, e?.text)) {
    diffs.text = {
      actual: a?.text ?? "",
      expected: e?.text ?? "",
    };
  }

  // styles: kun de nøgler der afviger
  if (a?.styles || e?.styles) {
    const allKeys = Cypress._.union(
      Object.keys(a?.styles || {}),
      Object.keys(e?.styles || {})
    );
    const s = {};
    allKeys.forEach((k) => {
      const va = a?.styles?.[k];
      const ve = e?.styles?.[k];
      if (!Cypress._.isEqual(va, ve)) s[k] = { actual: va, expected: ve };
    });
    if (Object.keys(s).length) diffs.styles = s;
  }

  // box: kun felter der afviger
  if (a?.box || e?.box) {
    const bkeys = ["x", "y", "width", "height"];
    const b = {};
    bkeys.forEach((k) => {
      const va = a?.box?.[k];
      const ve = e?.box?.[k];
      if (!Cypress._.isEqual(va, ve)) b[k] = { actual: va, expected: ve };
    });
    if (Object.keys(b).length) diffs.box = b;
  }

  return diffs;
}

// ---------- overlay (placeret på body, fixed ift. viewport) ----------
function drawOverlayOnBody(rootEl, flatList) {
  // Fjern evt. eksisterende overlay
  const oldOverlay = rootEl.querySelector(".__dom_overlay__");
  if (oldOverlay) oldOverlay.remove();

  // Sørg for at rootEl er positioneret
  if (getComputedStyle(rootEl).position === "static") {
    rootEl.style.position = "relative";
  }

  // Opret overlay-container
  const overlay = document.createElement("div");
  overlay.className = "__dom_overlay__";
  overlay.style.position = "absolute";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.width = rootEl.getBoundingClientRect().width + "px";
  overlay.style.height = rootEl.getBoundingClientRect().height + "px";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "999999";
  rootEl.appendChild(overlay);

  // Tilføj kasser
  flatList.forEach((item) => {
    const marker = document.createElement("div");
    marker.className = "__dom_marker__";
    marker.style.position = "absolute";
    marker.style.left = `${item.box.x}px`;
    marker.style.top = `${item.box.y}px`;
    marker.style.width = `${item.box.width}px`;
    marker.style.height = `${item.box.height}px`;
    marker.style.border = "2px solid rgba(255,0,0,0.95)";
    marker.style.backgroundColor = "rgba(255,0,0,0.05)";
    marker.style.boxSizing = "border-box";
    overlay.appendChild(marker);
  });
}

// ---------- hovedfunktion/kommando ----------
function assertDomListDeepEqual(actualList, expectedList, rootEl) {
  const isEqual = Cypress._.isEqual;
  const actual = (actualList || []).map(stripUndefined);
  const expected = (expectedList || []).map(stripUndefined);

  const mismatches = [];
  const len = Math.max(actual.length, expected.length);

  for (let i = 0; i < len; i++) {
    const a = actual[i];
    const e = expected[i];
    if (!isEqual(a, e)) {
      const reason =
        i >= actual.length
          ? "missing-actual"
          : i >= expected.length
          ? "unexpected-actual"
          : "deep-unequal";

      const fields = reason === "deep-unequal" ? diffObjectFields(a, e) : {};
      mismatches.push({ idx: i, reason, fields, actual: a, expected: e });
    }
  }

  // Gem mismatch-detaljer til evt. efterbehandling
  cy.wrap(mismatches, { log: false }).as("domMismatches");

  // Byg præcis, fokuseret fejltekst (kun felter der afviger)
  const header =
    `DOM snapshot: ${mismatches.length} mismatch(es)` +
    (actual.length !== expected.length
      ? ` (len actual=${actual.length}, expected=${expected.length})`
      : "");

  let summary = "";
  if (mismatches.length) {
    const first = mismatches[0];
    const fieldNames = Object.keys(first.fields);
    summary += `\nFirst mismatch @index ${first.idx} (reason=${first.reason})`;
    if (fieldNames.length) summary += `\nFields: ${fieldNames.join(", ")}`;

    // Print kun de afvigende felter – tekst kun hvis tekst afviger
    const lines = [];
    if (first.fields.tag)
      lines.push(
        `  tag:        ${first.fields.tag.actual}  !==  ${first.fields.tag.expected}`
      );
    if (first.fields.testid)
      lines.push(
        `  testid:     ${first.fields.testid.actual}  !==  ${first.fields.testid.expected}`
      );
    if (first.fields.role)
      lines.push(
        `  role:       ${first.fields.role.actual}  !==  ${first.fields.role.expected}`
      );
    if (first.fields.text) {
      const a = (first.fields.text.actual ?? "").toString();
      const e = (first.fields.text.expected ?? "").toString();
      const trunc = (s) => (s.length > 160 ? s.slice(0, 160) + "…" : s);
      lines.push("  text.actual:   " + JSON.stringify(trunc(a)));
      lines.push("  text.expected: " + JSON.stringify(trunc(e)));
    }
    if (first.fields.box) {
      const b = first.fields.box;
      lines.push("  box diffs:     " + JSON.stringify(b));
    }
    if (first.fields.styles) {
      const sKeys = Object.keys(first.fields.styles).slice(0, 10); // vis kun de første 10 nøgler
      const pickStyles = Object.fromEntries(
        sKeys.map((k) => [k, first.fields.styles[k]])
      );
      lines.push("  styles diffs:  " + JSON.stringify(pickStyles));
      if (Object.keys(first.fields.styles).length > sKeys.length) {
        lines.push(
          `  …and ${
            Object.keys(first.fields.styles).length - sKeys.length
          } more style diffs`
        );
      }
    }
    summary += "\n" + lines.join("\n");
  }
  // Marker visuelt de elementer, der kan markeres (dvs. findes i actual)
  if (rootEl && mismatches.length) {
    const toMark = mismatches
      .filter((m) => m.reason !== "missing-actual") // kun dem hvor vi har actual box
      .map((m) => actualList[m.idx])
      .filter(Boolean);
    if (toMark.length) {
      console.log("toMark", toMark);
      drawOverlayOnBody(rootEl, toMark);
    }
  }

  expect(mismatches, `${header}${summary}`).to.be.empty;
}

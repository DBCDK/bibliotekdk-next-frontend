/**
 * 500.js - 500 errors can happen both client-side and server-side
 * we have en _error page to handle that.
 * @see https://nextjs.org/docs/advanced-features/custom-error-page#500-page
 */

import { log } from "dbc-node-logger";

/**
 * Handle 500 errorcode
 * @param statusCode
 * @returns {JSX.Element}
 * @constructor
 */

function Error({ statusCode, incErrors }) {
  // log for kibana
  log.error(`INTERNAL ERROR:${statusCode}`, { severity: "ERROR" });
  // increase error count for howru function
  incErrors();
  // @TODO - a proper 500 page
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  let incErrors = null;
  if (typeof window === "undefined") {
    incErrors = require("../utils/errorCount").incErrorCount;
  }
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, incErrors };
};

export default Error;

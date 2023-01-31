/**
 * _error.js - 500 errors can happen both client-side and server-side
 * we have en _error page to handle that.
 * @see https://nextjs.org/docs/advanced-features/custom-error-page#500-page
 */

import { log } from "dbc-node-logger";
import Custom500 from "@/pages/500";

/**
 * Handle 500 errorcode - return page not found
 * @returns {JSX.Element}
 * @constructor
 */

function Error() {
  return <Custom500 />;
}

/**
 * Get serverside props - if an error is serverside - log it and increase
 * errorcount for howru function
 * @param res
 * @param err
 * @returns {{statusCode: (*|number)}}
 */
Error.getInitialProps = ({ res, err }) => {
  let incErrors = null;
  if (typeof window === "undefined") {
    incErrors = require("../utils/errorCount").incErrorCount;
    // log for kibana
    log.error(`INTERNAL ERROR`, { severity: "ERROR" });
    // increase error count for howru function
    incErrors();
  }

  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

/**
 * _error.js - 500 errors can happen both client-side and server-side
 * we have en _error page to handle that.
 * @see https://nextjs.org/docs/advanced-features/custom-error-page#500-page
 */

import { log } from "dbc-node-logger";
import ErrorPage from "@/pages/fejl";
import { Custom as Custom404Inner } from "@/pages/404";

/**
 * Handle 500 errorcode - return page not found
 * @returns {React.JSX.Element}
 */

function AppErrorPage({ statusCode }) {
  if (statusCode === 404) {
    // Prefer the dedicated 404 page UI
    return <Custom404Inner />;
  }
  return <ErrorPage statusCode={statusCode} />;
}

/**
 * Get serverside props - if an error is serverside - log it and increase
 * errorcount for howru function
 * @param res
 * @param err
 * @returns {{statusCode: (*|number)}}
 */
AppErrorPage.getInitialProps = ({ req, res, err }) => {
  let incErrors = null;
  if (typeof window === "undefined") {
    incErrors = require("../utils/errorCount").incErrorCount;

    // log for kibana
    log.error("SERVER SIDE ERROR", {
      error: String(err),
      stacktrace: err?.stack,
      url: req?.url,
    });

    // increase error count for howru function
    incErrors();
  }

  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default AppErrorPage;

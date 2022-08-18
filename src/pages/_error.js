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
function Error({ statusCode }) {
  console.log(statusCode);
  log.error(`INTERNAL ERROR:${statusCode}`, { severity: "ERROR" });
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

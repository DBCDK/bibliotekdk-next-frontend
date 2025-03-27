import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { fetcher } from "@/lib/api/api";

/**
 * Parse response
 * @param response
 * @returns {React.JSX.Element}
 */
function parseRis(response) {
  return response.data.ris;
}

/**
 * Do the query via fetcher - @see /lib/api/api.js
 * @param {Array<String> | String} pidOrPids
 * @param accessToken
 * @returns {Promise<*>}
 */
export async function getRis(pidOrPids, headers) {
  const pids = Array.isArray(pidOrPids) ? pidOrPids : [pidOrPids];
  const querystr = manifestationFragments.ris(pids);

  const paramsForApi = { ...querystr };
  const response = await fetcher(paramsForApi, undefined, undefined, {
    headers,
  });
  return parseRis(response);
}

/**
 * Entry point
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export default async function risHandler(req, res) {
  // get ris
  const { pids } = req.query;
  const pidsAsArray = pids.split(",");
  const response = await getRis(pidsAsArray, req.headers);
  // send response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(response);
}

import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { fetcher } from "@/lib/api/api";
import { getAccessToken } from "./refworks";

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
 * @param pid
 * @param accessToken
 * @returns {Promise<*>}
 */
export async function getRis(pid, accessToken) {
  const querystr = manifestationFragments.ris(pid);
  const paramsForApi = { ...querystr, accessToken };
  const response = await fetcher(paramsForApi);
  return parseRis(response);
}

/**
 * Entry point
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export default async function risHandler(req, res) {
  // get an access token for api
  const context = { req, res };
  const accessToken = await getAccessToken(context);
  // get refworks
  const { pid } = req.query;
  const response = await getRis(pid, accessToken);
  // send response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(response);
}

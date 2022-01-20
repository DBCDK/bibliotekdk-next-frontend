import { ris } from "@/lib/api/manifestation.fragments";
import { fetcher } from "@/lib/api/api";
import { getAccessToken } from "./refworks";

/**
 * Parse response
 * @param ref
 * @return {*}
 */
function parseRis(response) {
  console.log(response, "RESPONSE");
  return response.data.ris;
}

/**
 * Do the query via fetcher - @see /lib/api/api.js
 * @param pid
 * @param accessToken
 * @return {Promise<*>}
 */
async function getRis(pid, accessToken) {
  const querystr = ris(pid);
  console.log(querystr, "QUERY");
  const paramsForApi = { ...querystr, accessToken };
  const response = await fetcher(paramsForApi);
  return parseRis(response);
}

/**
 * Entry point
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export default async function risHandler(req, res) {
  // get an access token for api
  const context = { req, res };
  const accessToken = await getAccessToken(context);

  console.log(accessToken, "TOKEN");
  // get refworks
  const { pid } = req.query;
  const response = await getRis(pid, accessToken);
  // send response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(response);
}

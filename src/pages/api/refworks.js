import { refWorks } from "@/lib/api/manifestation.fragments";
import { fetcher } from "@/lib/api/api";

import { getAnonSession } from "@/lib/api/apiServerOnly";
import { getSession } from "next-auth/client";

/**
 * Parse response
 * @param ref
 * @return {*}
 */
function parseRefWorks(ref) {
  return ref.data.refWorks;
}

/**
 * Do the query via fetcher - @see /lib/api/api.js
 * @param pid
 * @param accessToken
 * @return {Promise<*>}
 */
async function getRefWorks(pid, accessToken) {
  const querystr = refWorks(pid);
  const paramsForApi = { ...querystr, accessToken };
  const ref = await fetcher(paramsForApi);
  return parseRefWorks(ref);
}

/**
 * Get accesstoken - anonymous/user
 * @param context
 * @return {Promise<*>}
 */
export async function getAccessToken(context) {
  const session = await getSession(context);
  const anonSession = await getAnonSession(context);
  const accessToken = session?.accessToken || anonSession?.accessToken;

  return accessToken;
}

/**
 * Entry point
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export default async function refWorkHandler(req, res) {
  // get an access token for api
  const context = { req, res };
  const accessToken = await getAccessToken(context);
  // get refworks
  const { pid } = req.query;
  const response = await getRefWorks(pid, accessToken);
  // send response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(response);
}

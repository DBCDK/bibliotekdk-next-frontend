import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { fetcher } from "@/lib/api/api";
import { getServerSession } from "@dbcdk/login-nextjs/server";

/**
 * Parse response
 * @param ref
 * @returns {React.JSX.Element}
 */
function parseRefWorks(ref) {
  return ref.data.refWorks;
}

/**
 * Do the query via fetcher - @see /lib/api/api.js
 * @param pid
 * @param accessToken
 * @returns {Promise<*>}
 */
async function getRefWorks(pids, headers) {
  const querystr = manifestationFragments.refWorks({ pids: pids });
  const paramsForApi = { ...querystr };
  const ref = await fetcher(paramsForApi, undefined, undefined, { headers });
  return parseRefWorks(ref);
}

/**
 * Get accesstoken - anonymous/user
 * @param context
 * @returns {Promise<*>}
 */
export async function getAccessToken(context) {
  const session = await getServerSession(context.req, context.res);
  return session?.accessToken;
}

/**
 * Entry point
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export default async function refWorkHandler(req, res) {
  // get refworks
  const { pids } = req.query;
  const pidsAsArray = pids.split(",");
  const response = await getRefWorks(pidsAsArray, req.headers);
  // send response
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(response);
}

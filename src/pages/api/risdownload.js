import { getAccessToken } from "@/pages/api/refworks";
import { getRis } from "@/pages/api/ris";

/**
 * return NOW in the form yyyymmdd_hhmmss
 * @returns {string}
 */
export function getRisTimeStamp() {
  const date = new Date();
  const time =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    "_" +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  return time;
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

  const { pids } = req.query;
  const pidsAsArray = pids.split(",");
  const response = await getRis(pidsAsArray, accessToken);

  const FILENAME = "bibdk_" + getRisTimeStamp() + ".ris";

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment;filename=${FILENAME}`);
  res.status(200).send(response);
}

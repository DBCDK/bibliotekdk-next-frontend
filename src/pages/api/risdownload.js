import { getAccessToken } from "@/pages/api/refworks";
import { getRis } from "@/pages/api/ris";

const FILENAME = "RIS-Export";

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

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment;filename=${FILENAME}`);
  res.status(200).send(response);
}

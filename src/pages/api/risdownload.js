import { getAccessToken } from "@/pages/api/refworks";
import { getRis } from "@/pages/api/ris";

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

  const { pid } = req.query;
  const response = await getRis(pid, accessToken);

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment;filename=${pid}`);
  res.status(200).send(response);
}

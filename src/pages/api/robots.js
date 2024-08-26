import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
const { allowRobots } = serverRuntimeConfig;

export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");

  // Dynamisk generering af robots.txt indhold
  const robotsTxt = `User-agent: *
${allowRobots ? "Allow" : "Disallow"}: /
`;

  res.status(200).send(robotsTxt);
}

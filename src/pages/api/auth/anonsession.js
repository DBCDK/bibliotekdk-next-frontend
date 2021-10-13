import fetch from "isomorphic-unfetch";
import jwt from "jsonwebtoken";
import getConfig from "next/config";
const { serverRuntimeConfig = {} } = getConfig() || {};
const { clientId, clientSecret, jwtSecret } = serverRuntimeConfig;

export default async (req, res) => {
  const token = req.query.jwt;
  try {
    // Will throw if jwt is expired or invalid
    const decoded = jwt.verify(token, jwtSecret);
    res.status(200).json({ session: decoded, jwt: token });
  } catch (e) {
    // Fetch anonymous accesstoken
    const tokenRes = await fetch("https://login.bib.dk/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: `grant_type=password&username=@&password=@&client_id=${encodeURIComponent(
        clientId
      )}&client_secret=${encodeURIComponent(clientSecret)}`,
    });
    const json = await tokenRes.json();
    const anonymousSession = {
      accessToken: json.access_token,
    };

    // Create jwt and set expiry to the same time access token expires
    const token = jwt.sign(anonymousSession, jwtSecret, {
      expiresIn: json.expires_in,
    });

    res.status(200).json({ session: anonymousSession, jwt: token });
  }
};

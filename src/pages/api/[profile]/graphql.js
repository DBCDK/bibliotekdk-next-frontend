import { decode } from "next-auth/jwt";

const fbiApiUrl = new URL(process.env.NEXT_PUBLIC_FBI_API_URL).origin;
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const profile = req.query.profile;
  const jwtCookie =
    req.cookies["next-auth.session-token"] ||
    req.cookies["next-auth.anon-session"];

  const jwtToken = await decode({
    token: jwtCookie,
    secret,
  });

  const accessToken = jwtToken?.accessToken;

  const graphqlRes = await fetch(`${fbiApiUrl}/${profile}/graphql`, {
    method: "POST",
    headers: {
      ...req.headers,
      Authorization: `bearer ${accessToken}`,
    },
    body: JSON.stringify(req.body),
  });
  const json = await graphqlRes.json();

  res.status(graphqlRes.status).json(json);
}

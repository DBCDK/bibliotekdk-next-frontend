import { serialize } from "cookie";

const COOKIE_NAME = "verification.cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("server delete was called .....");

  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // Sætter en udløbsdato i fortiden
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ success: true });
}

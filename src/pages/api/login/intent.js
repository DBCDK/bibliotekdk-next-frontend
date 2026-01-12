import { encodeIntent, setIntentCookie } from "@/lib/loginIntent.utils";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { pid, provider } = req.body || {};
  if (!pid) return res.status(400).json({ error: "Missing pid" });

  const jwt = await encodeIntent({ pid, provider });
  setIntentCookie(req, res, jwt);

  res.status(200).json({ ok: true });
}

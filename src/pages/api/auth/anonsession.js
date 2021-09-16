import { fetchAnonymousSession } from "@/lib/anonymousSession";

export default async (req, res) => {
  const session = await fetchAnonymousSession({ req, res });
  res.status(200).json(session);
};

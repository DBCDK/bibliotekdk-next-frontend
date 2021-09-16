import { fetcher } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as searchFragments from "@/lib/api/search.fragments";
import { fetchAnonymousSession } from "@/lib/anonymousSession";

const upSince = new Date();

/**
 * The howru handler
 *
 * We make requests for all our GraphQL fragments
 */
export default async function handler(req, res) {
  const session = await fetchAnonymousSession({ req, res });
  // If any of the services fail, this is set to false
  let ok = true;

  // Create service object for each fragment
  const services = [
    ...Object.entries(workFragments).map(([name, func]) => ({
      service: `api-work-${name}`,
      handler: () =>
        fetcher({
          ...func({ workId: "work-of:870970-basis:23154382" }),
          accessToken: session?.accessToken,
        }),
    })),
    ...Object.entries(searchFragments).map(([name, func]) => ({
      service: `api-search-${name}`,
      handler: () =>
        fetcher({ ...func({ q: "hest" }), accessToken: session?.accessToken }),
    })),
  ];

  // Perform requests
  const results = await Promise.all(
    services.map(async (service) => {
      const res = { service: service.service };
      try {
        const { error } = await service.handler();
        if (error) {
          ok = false;
          res.ok = false;
        } else {
          res.ok = true;
        }
      } catch (e) {
        ok = false;
        res.ok = false;
      }
      return res;
    })
  );

  res.status(ok ? 200 : 500).json({ ok, upSince, services: results });
}

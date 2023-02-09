import { fetcher } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as searchFragments from "@/lib/api/search.fragments";
import { getServerSession } from "@dbcdk/login-nextjs/server";

import { getErrorCount, resetErrorCount } from "@/utils/errorCount";
import getConfig from "next/config";
import { log } from "dbc-node-logger";
const { serverRuntimeConfig } = getConfig();
const { maxError500Count } = serverRuntimeConfig;

const upSince = new Date();

let session;

/**
 * The howru handler
 *
 * We make requests for all our GraphQL fragments
 */
export default async function handler(req, res) {
  // If any of the services fail, this is set to false
  let ok = true;

  try {
    if (!session) {
      session = await getServerSession(req, res);
    }
  } catch (e) {
    log.error(`howru throws exception:`, {
      error: String(e),
      stacktrace: e.stack,
    });
  }
  // Create service object for each fragment
  const services = [
    ...Object.entries(workFragments).map(([name, func]) => ({
      service: `api-work-${name}`,
      handler: () =>
        fetcher({
          ...func({
            workId: "work-of:870970-basis:23154382",
            pid: "870970-basis:23154382",
          }),
          accessToken: session?.accessToken,
        }),
    })),
    ...Object.entries(searchFragments).map(([name, func]) => ({
      service: `api-search-${name}`,
      handler: () =>
        fetcher({
          ...func({ q: { all: "hest" }, limit: 10 }),
          accessToken: session?.accessToken,
        }),
    })),
  ];

  // Perform requests
  const results = await Promise.all(
    services.map(async (service) => {
      const res = { service: service.service };
      try {
        const { error, errors } = await service.handler();

        if (error || errors) {
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

  // get an object for 500 errors
  const error500 = await errorCode500();
  // check object status
  if (!error500.ok) {
    // set overall status
    ok = false;
  }
  // push error500 object to results
  results.push(error500);

  res.status(ok ? 200 : 500).json({ ok, upSince, services: results });
}

async function errorCode500() {
  const count = await getErrorCount();
  // check if more errors than allowed is found
  const error500ok = parseInt(count) < maxError500Count;
  // add an object that counts number of 500 errors
  const error500 = {
    service: "500Count",
    count500: count,
    ok: error500ok,
  };
  //howru has finished handling errorcount - reset errorcounter
  resetErrorCount();

  return error500;
}

import { adgangsplatformen, callbacks } from "@dbcdk/login-nextjs";
import { NextAuth } from "@dbcdk/login-nextjs";
import { log } from "dbc-node-logger";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
const { clientId, clientSecret } = serverRuntimeConfig;

if (!clientId || !clientSecret) {
  log.error("ClientId or/and clientSecret was not set. Login is not possible");
}

export const options = {
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        expires: null,
      },
    },
  },
  providers: [
    adgangsplatformen({
      clientId,
      clientSecret,
    }),
  ],
  debug: false,
  callbacks: {
    ...callbacks,
    session: async (...args) => {
      let res = await callbacks.session(...args);
      delete res?.user?.agencies;
      return res;
    },
  },
};

export default NextAuth(options);

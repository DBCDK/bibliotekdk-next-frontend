import { destroyCookie } from "nookies";
import NextAuth from "next-auth";
import { adgangsplatformen, callbacks } from "@dbcdk/login-nextjs";
import { log } from "dbc-node-logger";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
const { clientId, clientSecret } = serverRuntimeConfig;

if (!clientId || !clientSecret) {
  log.error("ClientId or/and clientSecret was not set. Login is not possible");
}

const options = {
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
      profile(user) {
        return user;
      },
    }),
  ],
  debug: false,
  callbacks: {
    ...callbacks,
  },
};
export default (req, res) => {
  if (req.url.includes("signout")) {
    destroyCookie({ req, res }, "anon.session", { path: "/" });
  }
  return NextAuth(req, res, options);
};

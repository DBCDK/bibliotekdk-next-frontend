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
  jwt: {
    secret: serverRuntimeConfig.jwtSecret,
  },
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
    // We override jwt token creator for now
    async jwt(token, user, account, profile) {
      if (user) {
        token = {
          accessToken: account.accessToken,
          attributes: profile.attributes,
          profile,
        };
      }
      // We don't need the agencies set them to empty arrays
      // to avoid exceeding the size limit of the jwt token
      token.attributes.agencies = [];
      token.profile.attributes.agencies = [];
      return token;
    },
  },
};
export default (req, res) => {
  if (req.url.includes("signout")) {
    destroyCookie({ req, res }, "anon.session", { path: "/" });
  }
  return NextAuth(req, res, options);
};

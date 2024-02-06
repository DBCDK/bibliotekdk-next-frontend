import {
  adgangsplatformen,
  callbacks,
  testUserProvider,
} from "@dbcdk/login-nextjs";
import { NextAuth } from "@dbcdk/login-nextjs";
import { log } from "dbc-node-logger";
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
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
        sameSite: "Lax",
        secure: true,
        path: "/",
        expires: null,
      },
    },
    anonymousSessionToken: {
      name: `next-auth.anon-session`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        expires: null,
      },
    },
  },
  pages: {
    // Error code passed in query string as ?error=
    // https://next-auth.js.org/configuration/pages#sign-in-page
    signIn: "/login/fejl",
    // Error code passed in query string as ?error=
    // https://next-auth.js.org/configuration/pages#error-page
    error: "/login/fejl",
  },
  providers: [
    adgangsplatformen({
      clientId,
      clientSecret,
      profile: async ({ profile }) => {
        return {
          id: profile?.attributes?.uniqueId || profile?.attributes?.userId,
        };
      },
    }),
    testUserProvider({
      clientId,
      clientSecret,
      fbiApiUrl: publicRuntimeConfig.fbi_api.url,
    }),
  ],
  debug: false,
  callbacks: {
    ...callbacks,
    jwt: async ({ token, user, account, profile }) => {
      const EXPIRY_BUFFER_SEC = 60;

      if (user) {
        // Exclude user agencies from jwt cookie
        // The agencies list can exceed the cookie byte limit (even for chunks)
        delete profile?.attributes?.agencies;

        token = {
          accessToken: account.access_token,
          accessTokenExpires:
            account.expires_at * 1000 - EXPIRY_BUFFER_SEC * 1000,
          attributes: profile.attributes,
        };
      }

      if (!token.accessTokenExpires || token.accessTokenExpires < Date.now()) {
        return null;
      }
      return token;
    },
    session: async (...args) => {
      let res = await callbacks.session(...args);
      // TODO: Agencies are now removed in jwt callback
      // This could be removed when all active sessions are expired (30 days from now)
      delete res?.user?.agencies;
      return res;
    },
  },
  logger: {
    error(code, metadata) {
      log.error("next-auth login error", {
        stacktrace: metadata.stack,
        nextAuthErrorCode: code,
      });
    },
  },
};

export default NextAuth(options);

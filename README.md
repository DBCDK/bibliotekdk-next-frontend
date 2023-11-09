# The Next bibliotek.dk Frontend

This is the frontend part of the next bibliotek.dk.
The application is built with Next.js, React, and GraphQL. Storybook is used for showcasing and testing components in isolation. Cypress is used for testing.

## Getting started

The development environment may be set up using either npm or docker-compose.

### npm

- `npm install`
- `npm run dev:storybook` starts a Storybook development server for developing React components in isolation
- `npm run dev:next` starts Next.js development server that runs the actual application
- `npm run cy:open` runs the test suite

### Cypress single test in with cypress run

- cd into (the first) e2e folder and execute `npx cypress@10.3.0 run --spec "./cypress/e2e/[name of the test].cy.js"` will run one specific test.

### docker-compose

- `docker-compose -f docker-compose-dev.yml up` will start Storybook on port 4000, Next.js on port 3000
- `docker run --network="host" -ti --rm -v $(pwd)/e2e:/app/e2e -e CYPRESS_baseUrl=http://localhost:4000 docker.dbc.dk/cypress:latest npm run cy` runs tests (only headless mode supported via docker)

## Environment Variables

The following environment variables can be set in the application. Variables prefixed with NEXT*PUBLIC* are available from the application running in the browser.

- **PORT**
  Port on which Next.js runs. Default is 3000.
- **STORYBOOK_PORT**
  Port on which storybook runs. Default is 4000.
- **USE_FIXED_SESSION_ID**
  Set to false in production. When set to true, the session id is set to "test", when collecting data. This allow AI to remove entries with session_id=test. Default is true.
- **NEXT_PUBLIC_API_URL**
  URL to the GraphQL API. Default is http://bibliotekdk-next-api-1.febib-staging.svc.cloud.dbc.dk/graphql.
- - **NEXT_PUBLIC_FBI_API_URL**
    URL to the FBI_API GraphQL API. Default is https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql.
- **API_TIMEOUT_MS**
  Time in ms for how long the Next.js server should wait for data when doing server side rendering. Default is 150.
- **NEXTAUTH_URL**
  Used for generating redirect uris. Set to root pageNo URL, like https://alfa.bibliotek.dk
- **JWT_SECRET**
  Secret used to sign JWT
- **CLIENT_ID**
  The smaug client id
- **CLIENT_SECRET**
  The smaug client secret
- **ELBA_DRY_RUN**
  Per default true to avoid sending actual requests to elba.

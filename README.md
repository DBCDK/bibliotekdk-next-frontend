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

### docker-compose

 - `docker-compose -f docker-compose-dev.yml up` will start Storybook on port 4000, Next.js on port 3000
 - `docker run --network="host" -ti --rm -v $(pwd)/e2e:/app/e2e -e CYPRESS_baseUrl=http://localhost:4000 docker.dbc.dk/cypress:latest npm run cy` runs tests (only headless mode supported via docker)


ARG NODE_BASEIMAGE=docker-dbc.artifacts.dbccloud.dk/dbc-node:latest
# ---- Base Node ----
FROM  $NODE_BASEIMAGE AS build
# set working directory
WORKDIR /home/node/app

# copy only package-files (npm ci cached)
COPY --chown=node:node package.json package-lock.json ./
USER node

RUN npm version

# install dependencies
RUN npm set progress=false && npm config set depth 0 && \
    npm ci

# copy rest of project files
COPY --chown=node:node . .

# Run lint and tests (f is formatted)
RUN npm run prettier:check:f
RUN npm run lint:f
RUN npm run test:f

RUN npm run build:storybook:f && \
    npm run build:next:no:lint:f && \
    npm prune --production

# ---- Release ----
FROM $NODE_BASEIMAGE AS release
WORKDIR /home/node/app
COPY --chown=node:node --from=build /home/node/app/dist ./dist
COPY --chown=node:node --from=build /home/node/app/public ./public
COPY --chown=node:node --from=build /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/app/package.json ./
COPY --chown=node:node --from=build /home/node/app/next.config.js ./
COPY --chown=node:node --from=build /home/node/app/logger.js ./

EXPOSE 3000 4000
USER node
CMD npm run start

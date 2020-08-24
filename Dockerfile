ARG NODE_BASEIMAGE=docker.dbc.dk/dbc-node:latest
# ---- Base Node ----
FROM  $NODE_BASEIMAGE AS build
# set working directory
WORKDIR /home/node/app
# copy project file
COPY . .

# install dependencies
RUN npm set progress=false && npm config set depth 0 && \
    npm install

# Run lint
RUN npm run lint

# build for production
RUN npm run build:storybook && \
    npm run build:next && \
    npm prune --production

# ---- Release ----
FROM $NODE_BASEIMAGE AS release
WORKDIR /home/node/app
COPY --chown=node:node --from=build /home/node/app/dist ./dist
COPY --chown=node:node --from=build /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/app/package.json ./
COPY --chown=node:node --from=build /home/node/app/next.config.js ./

EXPOSE 3000 4000
USER node
CMD npm run start
FROM  docker.dbc.dk/dbc-node AS build

WORKDIR /home/node/app
COPY . .
# install node packages
RUN npm set progress=false && npm config set depth 0 && npm ci

ENV NODE_ENV production

RUN npm run build-storybook

CMD node -r esm -r dotenv/config src/index.js

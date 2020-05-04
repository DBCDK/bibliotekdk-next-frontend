# bibliotekdk-next-widgets

## Setup dev environment using docker

### Install dependencies and start the development server

```sh
$ docker-compose -f docker-compose-dev.yml up
... server running at http://localhost:3000/
```

### Run unit tests (Jest)

```sh
$ docker-compose -f docker-compose-dev.yml exec dev npm test
... test output
```

### Run integration tests in interactive mode (Cypress)
There is no one-liner to run cypress in interactive mode inside docker.
Probably easier to install npm and run the command:

```
$ npm run cy:open
```

### Run integration tests in headless mode (Cypress)
```
$ docker run --network="host" -ti --rm -v $(pwd)/e2e:/app/e2e -e CYPRESS_baseUrl=http://localhost:3000 docker.dbc.dk/cypress:latest npm run cy
```

## Setup dev environment using NPM

### Install dependencies

```sh
$ npm install
```

### Start the development server

```sh
$ npm run dev
... server running at http://localhost:3000/
```

### Run unit tests (Jest)

```
$ npm test
... test output
```

### Run integration tests in interactive mode (Cypress)

```
$ npm run cy:open
```
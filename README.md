# SOFA Api

## Development
Software requirements
- docker/docker-compose
- git
- make
- node/npm/npx

<br>

## Setup

```bash
# clone project
$ git clone https://github.com/stranerd/sofa-api

# setup git hooks
$ npx husky install

# create symbolic links for common types
$ make link-commons

# install dependencies for all microservices
$ make install-all

# copy env.example.json to env.json & fill in all env values in env.json
$ cp env.example.json env.json
```

<br>

## Run project

```bash
# start all containers without detach
$ make dev-start

# start all containers in detach mode
$ make dev-start-detach

# check logs if started in detach mode
$ make watch-logs

# stop all containers if started in detach mode
$ make dev-stop

# run in production mode in detach
$ make prod-start-detach
```

<br>

## Lint entire codebase

```bash
# ensure all microservices have a lint script defined in it
$ make lint-all
```
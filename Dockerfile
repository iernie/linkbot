FROM node:18-alpine as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

COPY tsconfig.json package-lock.json package.json ./
RUN npm ci
RUN npm run build

COPY --link . .

FROM base

COPY --from=build /app /app

CMD [ "npm", "run", "start" ]

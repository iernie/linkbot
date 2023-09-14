FROM node:18-alpine as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

COPY tsconfig.json package-lock.json package.json ./
RUN npm ci

COPY . .
RUN npm run build

COPY /build ./

FROM base

COPY --from=build /app /app

CMD [ "npm", "start" ]

FROM node:18-alpine as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

COPY tsconfig.json package-lock.json package.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM base

COPY package-lock.json package.json ./
RUN npm ci --production

COPY --from=build /app/build ./

CMD [ "node", "index.js" ]

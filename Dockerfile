FROM node:16-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk add sqlite-dev
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.8/litestream-v0.3.8-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:16-alpine as runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/next.config.js next.config.js
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/yarn.lock yarn.lock
COPY --from=builder /app/data.db data.db
COPY --from=builder /app/litestream.yml /etc/litestream.yml
COPY --from=builder /usr/local/bin/litestream /usr/local/bin/litestream
COPY --from=builder /app/run.sh /run.sh
CMD ["sh", "run.sh"]
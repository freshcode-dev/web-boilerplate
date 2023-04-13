# For better caching
FROM node:17-alpine as builder
WORKDIR /app

COPY . /app/

RUN apk --no-cache --virtual build-dependencies add python3 make g++
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm nx run-many --all --target=build


FROM node:17-alpine as runner
COPY --from=builder /app/dist/apps/api/ /app/
COPY --from=builder /app/dist/apps/frontend/ /app/client/
COPY --from=builder /app/apps/api/.env /app/

RUN mkdir -p /app/client/misc
COPY ./misc/env.sh /app/client/misc
COPY ./apps/frontend/.env /app/client/

RUN apk add --no-cache bash && chmod +x /app/client/misc/env.sh

EXPOSE 3000

CMD ["bash", "-c", "cd /app/client/ && ./misc/env.sh && cd /app/ && node main.js"]

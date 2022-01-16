# For better caching
FROM node:17-alpine as builder
WORKDIR /app

COPY . /app/

RUN yarn install
RUN yarn nx run-many --all --target=build


FROM node:17-alpine as runner
COPY --from=builder /app/dist/apps/api/ /app/
COPY /app/dist/apps/frontend/ /app/client/
COPY /app/apps/api/.env /app/

RUN mkdir -p /app/client/misc
COPY ./apps/frontend/misc/env.sh /app/client/misc
COPY ./apps/frontend/.env /app/client/

RUN apk add --no-cache bash && chmod +x /app/client/misc/env.sh

EXPOSE 3000

CMD ["bash", "-c", "cd /app/client/ && ./misc/env.sh && cd /app/ && node main.js"]

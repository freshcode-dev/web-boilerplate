# For better caching
FROM node:18-alpine as runner
WORKDIR /app

COPY ./dist/apps/api/package*.json /app/

RUN npm install -g pnpm
RUN pnpm install

COPY ./dist/apps/api/ /app/
COPY ./apps/api/.env /app/
COPY ./dist/apps/frontend/ /app/client/

RUN mkdir -p /app/client/misc
COPY ./misc/env.sh /app/client/misc/
COPY ./apps/frontend/.env /app/client/

RUN apk add --no-cache bash && chmod +x /app/client/misc/env.sh

EXPOSE 3000

CMD ["/bin/bash", "-c", "cd /app/client/ && ./misc/env.sh && cd /app/ && node main.js"]

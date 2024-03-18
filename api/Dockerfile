FROM node:14-slim as production
LABEL maintainer="bogdan@instigo.io"
ARG miroservice_name=api

WORKDIR /usr/app/
COPY ./*.json ./
COPY ./.npmrc  ./
COPY ./security/. ./security/
COPY ./libs/api/email ./libs/api/email/
COPY ./libs/api/slack-notification ./libs/api/slack-notification/
RUN npm i --prefer-offline --ignore-scripts --prod --reporter=silent --no-progress
COPY ./apps/$miroservice_name/. ./apps/$miroservice_name/
COPY ./dist/apps/$miroservice_name/. ./dist/apps/$miroservice_name/

EXPOSE 8080
CMD ["node", "dist/apps/api/main"]

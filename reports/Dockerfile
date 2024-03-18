FROM lupu60/base-relaxedjs:latest as production
LABEL maintainer="bogdan@instigo.io"
ARG miroservice_name=reports
WORKDIR /www/api.instigo.io/

RUN mkdir -p tmp
COPY ./*.json /www/api.instigo.io/
COPY ./.npmrc  /www/api.instigo.io/
RUN npm i --prefer-offline --ignore-scripts --prod --reporter=silent --no-progress

COPY ./libs/api/email /www/api.instigo.io/libs/api/email/

COPY ./apps/$miroservice_name/. /www/api.instigo.io/apps/$miroservice_name/
COPY ./dist/apps/$miroservice_name/. /www/api.instigo.io/dist/apps/$miroservice_name/
EXPOSE 8080
CMD ["node", "dist/apps/reports/main"]

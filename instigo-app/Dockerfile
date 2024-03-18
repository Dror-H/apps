FROM nginx:1.25.2-alpine
LABEL maintainer="bogdan@instigo.io"
RUN rm -rf /usr/share/nginx/html/*
COPY  ./dist/apps/instigo-app/. /usr/share/nginx/html/
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./apps/instigo-app/.nginx /etc/nginx/conf.d/
EXPOSE 8080
CMD ["/bin/sh" , "-c" , "envsubst '$${BACKEND_HOST}' < /etc/nginx/conf.d/instigo.io.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

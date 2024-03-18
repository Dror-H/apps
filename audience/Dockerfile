FROM nginx:1.21-alpine
LABEL maintainer="bogdan@instigo.io"
RUN rm -rf /usr/share/nginx/html/*
COPY  ./dist/apps/audience/. /usr/share/nginx/html/
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./apps/audience/.nginx /etc/nginx/conf.d/

EXPOSE 8080
CMD ["/bin/sh" , "-c" , "envsubst '$${BACKEND_HOST}' < /etc/nginx/conf.d/instigo.io.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

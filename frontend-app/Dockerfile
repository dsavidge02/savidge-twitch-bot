FROM nginx

USER root

RUN apt-get update && apt-get upgrade -y && apt-get clean

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist /usr/share/nginx/html
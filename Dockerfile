FROM node:9.1.0-alpine

EXPOSE 80
WORKDIR /var/www
VOLUME /certs

# Set timezone (https://wiki.alpinelinux.org/wiki/Setting_the_timezone)
RUN \
    apk update \
    && apk add tzdata \
    && cp /usr/share/zoneinfo/Europe/Helsinki /etc/localtime \
    && echo "Europe/Helsinki" >  /etc/timezone \
    && apk del tzdata

CMD [ "yarn", "start" ]

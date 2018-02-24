FROM node:9.1.0-alpine

WORKDIR /var/www

# Set timezone (https://wiki.alpinelinux.org/wiki/Setting_the_timezone)
RUN \
    apk update \
    && apk add tzdata \
    && cp /usr/share/zoneinfo/Europe/Helsinki /etc/localtime \
    && echo "Europe/Helsinki" >  /etc/timezone \
    && apk del tzdata

EXPOSE 80

CMD [ "yarn", "start" ]

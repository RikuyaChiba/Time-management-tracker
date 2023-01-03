FROM php:8.0-fpm

RUN set -x \
    && apt-get -y update \
    && apt-get install -y vim git unzip libzip-dev libicu-dev libonig-dev \ 
    && docker-php-ext-install intl pdo_mysql zip bcmath

RUN set -x \
    && apt-get install -y nodejs \
    && apt-get install -y npm

COPY dockerfile/app/php.ini /usr/local/etc/php/php.ini

COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /app
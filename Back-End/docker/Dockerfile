FROM php:8.4-fpm AS php

ENV COMPOSER_MEMORY_LIMIT=-1

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip \
    && rm -rf /var/lib/apt/lists/*

ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN install-php-extensions pdo_mysql zip ctype iconv xsl gd intl

COPY --link \
    --from=ghcr.io/symfony-cli/symfony-cli:latest \
    /usr/local/bin/symfony /usr/local/bin/symfony

COPY --link --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN echo "memory_limit=2G" > /usr/local/etc/php/conf.d/memory_limit.ini
RUN echo "post_max_size=512M" > /usr/local/etc/php/conf.d/post_max_size.ini
RUN echo "upload_max_filesize=512M" > /usr/local/etc/php/conf.d/upload_max_filesize.ini

RUN git config --system --add safe.directory /var/www/html

# USER app

FROM php AS composer-install

WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-scripts
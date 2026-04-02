# syntax=docker/dockerfile:1

# Production image for Coolify (and similar): Nginx :8080, PHP-FPM, Inertia SSR via Supervisor.
# Build: docker build -t pigpig .
# Worker: docker build --target worker -t pigpig-worker .
# Runtime: set APP_KEY, APP_URL, DB_*, REDIS_*, APP_ENV=production. Post-deploy: php artisan migrate --force

FROM php:8.4-cli-bookworm AS php_cli_runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        git \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libonig-dev \
        libpng-dev \
        libpq-dev \
        libwebp-dev \
        libzip-dev \
        unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        exif \
        gd \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo_pgsql \
        zip \
    && pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN git config --global --add safe.directory '*'

WORKDIR /var/www/html

FROM php:8.4-fpm-bookworm AS php_fpm_runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        git \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libonig-dev \
        libpng-dev \
        libpq-dev \
        libwebp-dev \
        libzip-dev \
        unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        exif \
        gd \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo_pgsql \
        zip \
    && pecl install redis \
    && docker-php-ext-enable redis

COPY docker/production/opcache.ini /usr/local/etc/php/conf.d/opcache-production.ini

WORKDIR /var/www/html

FROM php_cli_runtime AS assets

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY . .

RUN composer run-script post-autoload-dump --no-interaction

RUN cp .env.example .env \
    && php artisan key:generate --force --no-interaction

RUN npm ci \
    && npm run build \
    && npm run build:ssr \
    && rm -rf node_modules \
    && npm ci --omit=dev

RUN rm -f .env

FROM assets AS assets_for_worker

RUN rm -rf node_modules

FROM php_cli_runtime AS worker

COPY --from=assets_for_worker /var/www/html /var/www/html

COPY docker/production/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["php", "artisan", "queue:work", "redis", "--sleep=1", "--tries=3", "--max-time=3600"]

FROM php_fpm_runtime AS web

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx \
        supervisor \
        ca-certificates \
        gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY --from=assets /var/www/html /var/www/html

COPY docker/production/nginx.conf /etc/nginx/sites-available/default
COPY docker/production/supervisord.conf /etc/supervisor/conf.d/laravel.conf

COPY docker/production/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8080/up >/dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]

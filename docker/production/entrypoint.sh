#!/bin/sh
set -e

cd /var/www/html

chown -R www-data:www-data storage bootstrap/cache

if [ "${APP_ENV:-local}" = "production" ]; then
    php artisan config:cache --no-ansi
    php artisan route:cache --no-ansi
    php artisan view:cache --no-ansi
fi

exec "$@"

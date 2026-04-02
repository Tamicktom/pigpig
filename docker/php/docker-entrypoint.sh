#!/bin/sh
set -e

cd /var/www/html

(
    flock -w 600 9 || exit 1
    composer install --no-interaction --prefer-dist --no-progress
) 9>/tmp/composer-docker.lock

exec "$@"

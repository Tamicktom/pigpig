#!/bin/sh
set -e

cd /var/www/html

(
    flock -w 600 9 || exit 1
    if [ ! -x node_modules/.bin/vite ]; then
        echo "docker-entrypoint: Vite not installed, running npm install..."
        npm install
    fi
) 9>/tmp/npm-docker.lock

exec npm run dev -- --host 0.0.0.0 --port 5173

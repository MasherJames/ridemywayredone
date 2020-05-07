#!/usr/bin/env bash
set -e
python manage.py makemigrations
python manage.py migrate
exec gunicorn request.wsgi:application --bind 0.0.0.0:8000
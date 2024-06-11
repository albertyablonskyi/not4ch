#!/bin/bash

echo "Waiting for PostgreSQL initialization"

while ! nc -z $DATABASE_HOST $DATABASE_PORT; do 
    echo "PostgreSQL still not running, waiting..."
    sleep 1;
done;

# # Collect static files
echo "Collect static files"
python manage.py collectstatic --noinput

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ] && [ "$DJANGO_SUPERUSER_EMAIL" ]; then
    echo "Creating superuser..."
    python manage.py createsuperuser --noinput --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL
fi

# Run server
daphne -b 0.0.0.0 -p 8000 app.asgi:application
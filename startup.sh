#!/bin/bash
# Stop Nginx
service nginx stop

# Check if database.sqlite exists, and create it if it doesn't
if [ ! -f /home/site/wwwroot/database/database.sqlite ]; then
touch /home/site/wwwroot/database/database.sqlite
chmod 666 /home/site/wwwroot/database/database.sqlite
fi

# Ensure storage directories exist
mkdir -p /home/site/wwwroot/storage/framework/views
mkdir -p /home/site/wwwroot/storage/framework/cache
mkdir -p /home/site/wwwroot/storage/framework/sessions
mkdir -p /home/site/wwwroot/storage/logs

# Set correct permissions
chmod -R 775 /home/site/wwwroot/storage
chmod -R 775 /home/site/wwwroot/bootstrap/cache
chown -R www-data:www-data /home/site/wwwroot/storage
chown -R www-data:www-data /home/site/wwwroot/bootstrap/cache

# Run database migrations and seeders for demo data
php /home/site/wwwroot/artisan migrate --force
php /home/site/wwwroot/artisan db:seed --force

# Clear and cache Laravel configurations
php /home/site/wwwroot/artisan cache:clear
php /home/site/wwwroot/artisan config:clear
php /home/site/wwwroot/artisan config:cache
php /home/site/wwwroot/artisan route:clear
php /home/site/wwwroot/artisan view:clear
php /home/site/wwwroot/artisan view:cache

# Copy default Nginx configuration
cp /home/site/wwwroot/default /etc/nginx/sites-available/default
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Start Nginx
service nginx start

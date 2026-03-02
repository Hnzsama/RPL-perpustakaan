FROM php:8.4-fpm

# Arguments defined in docker-compose.yml
ARG user=www-data
ARG uid=1000

# Install system dependencies including nginx for serving HTTP traffic on Railway
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    nginx

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Setup working directory
WORKDIR /var/www

# Remove default server definition
RUN rm -rf /var/www/html

# Copy existing application directory contents
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=$user:$user . /var/www

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Accept Railway variables before build
ARG APP_URL
ENV APP_URL=$APP_URL

# Install dependencies and build assets
RUN composer install --no-interaction --optimize-autoloader --no-dev
RUN npm install
RUN npm run build

# Setting up Laravel permissions
RUN chown -R $user:$user /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Setup Nginx for single-container deployment (e.g. Railway)
COPY docker-compose/nginx/perpustakaan.conf /etc/nginx/sites-available/default
# Change port 80 to 8080 since we're not running as root, and use localhost for PHP-FPM
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/sites-available/default \
    && sed -i 's/fastcgi_pass app:9000;/fastcgi_pass 127.0.0.1:9000;/' /etc/nginx/sites-available/default

# Forward nginx logs
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Ensure nginx can be run by non-root user
RUN chown -R $user:$user /var/lib/nginx /var/log/nginx /run

# Create a startup script to run Laravel configurations, then start PHP-FPM and Nginx
RUN echo '#!/bin/sh\n\
php artisan migrate --force\n\
php artisan db:seed --force\n\
php artisan key:generate --force\n\
php artisan storage:link --force\n\
php artisan optimize:clear\n\
php artisan config:cache\n\
php artisan event:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
php-fpm -D\n\
nginx -g "daemon off;"' > /app-start.sh && chmod +x /app-start.sh

# Change current user to www
USER $user

# Expose HTTP port
EXPOSE 8080

CMD ["/app-start.sh"]

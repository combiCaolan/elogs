# Deployment Guide

## Table of Contents
1. [Deployment Overview](#deployment-overview)
2. [Environment Setup](#environment-setup)
3. [Production Deployment](#production-deployment)
4. [Staging Environment](#staging-environment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Security Configuration](#security-configuration)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup & Recovery](#backup--recovery)
10. [Maintenance Procedures](#maintenance-procedures)

## Deployment Overview

### Deployment Architecture
```
┌─────────────────────────────────────────┐
│             Load Balancer               │
│  • SSL termination                     │
│  • Traffic distribution                │
│  • Health checks                       │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Web Servers (2+)             │
│  • Apache/Nginx                        │
│  • PHP 7.4+                           │
│  • Application files                   │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          WordPress Database            │
│  • MySQL/MariaDB                       │
│  • User management                     │
│  • Session storage                     │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Shared Storage/CDN             │
│  • Static assets                       │
│  • Dictionary files                    │
│  • Application resources               │
└─────────────────────────────────────────┘
```

### Deployment Environments
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live user-facing environment
- **Disaster Recovery**: Backup production environment

## Environment Setup

### Server Requirements

#### Minimum Requirements
```yaml
Web Server:
  CPU: 2 cores
  RAM: 4GB
  Storage: 50GB SSD
  Network: 100Mbps

Database Server:
  CPU: 2 cores
  RAM: 8GB
  Storage: 100GB SSD
  Network: 1Gbps
```

#### Recommended Production Requirements
```yaml
Web Server (per instance):
  CPU: 4 cores
  RAM: 8GB
  Storage: 100GB SSD
  Network: 1Gbps

Database Server:
  CPU: 8 cores
  RAM: 32GB
  Storage: 500GB SSD (RAID 10)
  Network: 10Gbps

Load Balancer:
  CPU: 2 cores
  RAM: 4GB
  Storage: 20GB SSD
  Network: 10Gbps
```

### Software Stack

#### Operating System
```bash
# Ubuntu 20.04 LTS (Recommended)
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    apache2 \
    mysql-server \
    php7.4 \
    php7.4-mysql \
    php7.4-curl \
    php7.4-json \
    php7.4-mbstring \
    php7.4-xml \
    php7.4-zip \
    certbot \
    python3-certbot-apache
```

#### Web Server Configuration
```apache
# /etc/apache2/sites-available/elogs.conf
<VirtualHost *:443>
    ServerName elogs.yourdomain.com
    DocumentRoot /var/www/elogs
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/elogs.yourdomain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/elogs.yourdomain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/elogs.yourdomain.com/chain.pem
    
    # Security Headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png|ico)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Cache Control
    <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </FilesMatch>
    
    # Directory Security
    <Directory /var/www/elogs>
        AllowOverride All
        Options -Indexes +FollowSymLinks
        Require all granted
        
        # Protect sensitive files
        <FilesMatch "\.(sql|log|conf)$">
            Require all denied
        </FilesMatch>
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/elogs_error.log
    CustomLog ${APACHE_LOG_DIR}/elogs_access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName elogs.yourdomain.com
    Redirect permanent / https://elogs.yourdomain.com/
</VirtualHost>
```

## Production Deployment

### Automated Deployment Script
```bash
#!/bin/bash
# deploy.sh - Production deployment script

set -e  # Exit on any error

# Configuration
DEPLOY_USER="deploy"
APP_NAME="elogs"
APP_DIR="/var/www/elogs"
BACKUP_DIR="/var/backups/elogs"
REPO_URL="https://github.com/combilift/elogs.git"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if running as correct user
    if [ "$USER" != "$DEPLOY_USER" ]; then
        error "Must run as $DEPLOY_USER user"
    fi
    
    # Check disk space
    DISK_USAGE=$(df /var/www | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 80 ]; then
        error "Disk usage is ${DISK_USAGE}%. Need at least 20% free space."
    fi
    
    # Check services
    if ! systemctl is-active --quiet apache2; then
        error "Apache is not running"
    fi
    
    if ! systemctl is-active --quiet mysql; then
        error "MySQL is not running"
    fi
    
    log "Pre-deployment checks passed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/${APP_NAME}_backup_$TIMESTAMP"
    
    mkdir -p "$BACKUP_PATH"
    
    # Backup application files
    if [ -d "$APP_DIR" ]; then
        cp -r "$APP_DIR" "$BACKUP_PATH/app"
    fi
    
    # Backup database
    mysqldump -u backup_user -p$MYSQL_BACKUP_PASSWORD wordpress > "$BACKUP_PATH/database.sql"
    
    # Create backup manifest
    cat > "$BACKUP_PATH/manifest.txt" << EOF
Backup created: $(date)
Application directory: $APP_DIR
Database: wordpress
Git commit: $(cd $APP_DIR 2>/dev/null && git rev-parse HEAD 2>/dev/null || echo "unknown")
EOF
    
    # Compress backup
    tar -czf "${BACKUP_PATH}.tar.gz" -C "$BACKUP_DIR" "$(basename $BACKUP_PATH)"
    rm -rf "$BACKUP_PATH"
    
    log "Backup created: ${BACKUP_PATH}.tar.gz"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Create temporary directory for new version
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    # Clone repository
    git clone --branch "$BRANCH" --single-branch "$REPO_URL" .
    
    # Install/update dependencies if needed
    if [ -f "composer.json" ]; then
        composer install --no-dev --optimize-autoloader
    fi
    
    # Build assets if needed
    if [ -f "package.json" ]; then
        npm ci --production
        npm run build
    fi
    
    # Set proper permissions
    find . -type f -exec chmod 644 {} \;
    find . -type d -exec chmod 755 {} \;
    chmod 755 index.php Verify.php
    
    # Create maintenance mode
    echo "Application is temporarily unavailable for maintenance." > "$APP_DIR/maintenance.html"
    
    # Move current application out of the way
    if [ -d "$APP_DIR" ]; then
        mv "$APP_DIR" "${APP_DIR}_old"
    fi
    
    # Move new application into place
    mv "$TEMP_DIR" "$APP_DIR"
    
    # Update configuration for production
    update_production_config
    
    log "Application deployed successfully"
}

# Update production configuration
update_production_config() {
    log "Updating production configuration..."
    
    # Disable test mode
    sed -i 's/\$test_mode = True;/\$test_mode = False;/' "$APP_DIR/Verify.php"
    
    # Set production WordPress path
    sed -i "s|include_once('../wp-load.php');|include_once('$WORDPRESS_PATH/wp-load.php');|" "$APP_DIR/Verify.php"
    
    # Set proper permissions
    chown -R www-data:www-data "$APP_DIR"
    chmod -R 755 "$APP_DIR"
    chmod 644 "$APP_DIR"/*.php
}

# Run post-deployment tests
post_deployment_tests() {
    log "Running post-deployment tests..."
    
    # Test web server response
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://elogs.yourdomain.com/")
    if [ "$HTTP_STATUS" != "200" ]; then
        error "Website not responding correctly (HTTP $HTTP_STATUS)"
    fi
    
    # Test WordPress integration
    TEST_RESPONSE=$(curl -s "https://elogs.yourdomain.com/test-wp-integration.php")
    if [[ "$TEST_RESPONSE" != *"WordPress OK"* ]]; then
        warn "WordPress integration test failed"
    fi
    
    # Test file upload capability
    if [ ! -w "$APP_DIR/uploads" ]; then
        warn "Upload directory not writable"
    fi
    
    log "Post-deployment tests completed"
}

# Cleanup old deployments
cleanup() {
    log "Cleaning up..."
    
    # Remove maintenance mode
    rm -f "$APP_DIR/maintenance.html"
    
    # Remove old application directory
    if [ -d "${APP_DIR}_old" ]; then
        rm -rf "${APP_DIR}_old"
    fi
    
    # Keep only last 5 backups
    cd "$BACKUP_DIR"
    ls -t ${APP_NAME}_backup_*.tar.gz | tail -n +6 | xargs -r rm
    
    log "Cleanup completed"
}

# Rollback function
rollback() {
    error "Deployment failed. Rolling back..."
    
    # Restore from backup if available
    if [ -d "${APP_DIR}_old" ]; then
        rm -rf "$APP_DIR"
        mv "${APP_DIR}_old" "$APP_DIR"
        log "Rollback completed"
    else
        error "No backup available for rollback"
    fi
}

# Main deployment process
main() {
    log "Starting deployment of $APP_NAME..."
    
    # Set trap for cleanup on failure
    trap rollback ERR
    
    pre_deployment_checks
    create_backup
    deploy_application
    post_deployment_tests
    cleanup
    
    log "Deployment completed successfully!"
}

# Run deployment
main "$@"
```

### Docker Deployment
```dockerfile
# Production Dockerfile
FROM php:7.4-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Enable Apache modules
RUN a2enmod rewrite ssl headers deflate expires

# Copy application files
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Copy Apache configuration
COPY docker/apache/vhost.conf /etc/apache2/sites-available/000-default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80 443
```

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  web:
    build: .
    restart: unless-stopped
    volumes:
      - ./logs:/var/log/apache2
      - ./ssl:/etc/ssl/certs
    environment:
      - WORDPRESS_DB_HOST=db
      - WORDPRESS_DB_NAME=wordpress
      - WORDPRESS_DB_USER=wordpress
      - WORDPRESS_DB_PASSWORD=${DB_PASSWORD}
    depends_on:
      - db
    networks:
      - elogs-network

  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      - MYSQL_DATABASE=wordpress
      - MYSQL_USER=wordpress
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
      - ./mysql/my.cnf:/etc/mysql/conf.d/custom.cnf
    networks:
      - elogs-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
      - ./logs:/var/log/nginx
    depends_on:
      - web
    networks:
      - elogs-network

volumes:
  db_data:

networks:
  elogs-network:
    driver: bridge
```

## Staging Environment

### Staging Configuration
```bash
#!/bin/bash
# setup-staging.sh

# Staging environment setup
STAGING_DIR="/var/www/staging/elogs"
STAGING_DB="elogs_staging"

# Create staging directory
sudo mkdir -p "$STAGING_DIR"
sudo chown www-data:www-data "$STAGING_DIR"

# Clone staging branch
cd "$STAGING_DIR"
git clone -b staging https://github.com/combilift/elogs.git .

# Create staging database
mysql -u root -p << EOF
CREATE DATABASE $STAGING_DB;
GRANT ALL PRIVILEGES ON $STAGING_DB.* TO 'staging_user'@'localhost' IDENTIFIED BY 'staging_password';
FLUSH PRIVILEGES;
EOF

# Configure staging WordPress
cp wp-config-sample.php wp-config.php
sed -i "s/database_name_here/$STAGING_DB/" wp-config.php
sed -i "s/username_here/staging_user/" wp-config.php
sed -i "s/password_here/staging_password/" wp-config.php

# Enable staging mode
echo "define('WP_ENV', 'staging');" >> wp-config.php

# Set staging flag in application
sed -i 's/\$test_mode = False;/\$test_mode = True;/' Verify.php
```

### Staging Apache Configuration
```apache
<VirtualHost *:80>
    ServerName staging-elogs.yourdomain.com
    DocumentRoot /var/www/staging/elogs
    
    # Basic authentication for staging
    <Directory /var/www/staging/elogs>
        AuthType Basic
        AuthName "Staging Environment"
        AuthUserFile /etc/apache2/.htpasswd-staging
        Require valid-user
        
        AllowOverride All
        Options -Indexes +FollowSymLinks
    </Directory>
    
    # Add staging indicator
    Header always set X-Environment "staging"
    
    ErrorLog ${APACHE_LOG_DIR}/staging_elogs_error.log
    CustomLog ${APACHE_LOG_DIR}/staging_elogs_access.log combined
</VirtualHost>
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '7.4'
        extensions: mysqli, zip, gd
        
    - name: Install dependencies
      run: |
        if [ -f composer.json ]; then
          composer install --prefer-dist --no-progress
        fi
        
    - name: Run PHP linting
      run: |
        find . -name "*.php" -exec php -l {} \;
        
    - name: Run security check
      run: |
        # Add security scanning tools here
        echo "Security check placeholder"
        
    - name: Run unit tests
      run: |
        # Add unit tests here
        echo "Unit tests placeholder"

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to staging
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.STAGING_USER }}
        key: ${{ secrets.STAGING_SSH_KEY }}
        script: |
          cd /var/www/staging/elogs
          git pull origin main
          sudo systemctl reload apache2

  deploy-production:
    needs: [test, deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.PROD_HOST }}
        username: ${{ secrets.PROD_USER }}
        key: ${{ secrets.PROD_SSH_KEY }}
        script: |
          /home/deploy/deploy.sh
```

### GitLab CI/CD Pipeline
```yaml
# .gitlab-ci.yml
stages:
  - test
  - deploy-staging
  - deploy-production

variables:
  MYSQL_DATABASE: elogs_test
  MYSQL_ROOT_PASSWORD: test_password

test:
  stage: test
  image: php:7.4-cli
  services:
    - mysql:8.0
  before_script:
    - apt-get update -qq && apt-get install -y -qq git curl libzip-dev
    - docker-php-ext-install zip mysqli
  script:
    - find . -name "*.php" -exec php -l {} \;
    - echo "Run unit tests here"
  only:
    - merge_requests
    - main

deploy-staging:
  stage: deploy-staging
  script:
    - echo "Deploying to staging environment"
    - ssh deploy@staging-server "./deploy-staging.sh"
  only:
    - main
  environment:
    name: staging
    url: https://staging-elogs.yourdomain.com

deploy-production:
  stage: deploy-production
  script:
    - echo "Deploying to production environment"
    - ssh deploy@prod-server "./deploy.sh"
  only:
    - main
  when: manual
  environment:
    name: production
    url: https://elogs.yourdomain.com
```

## Security Configuration

### SSL/TLS Configuration
```bash
#!/bin/bash
# setup-ssl.sh - SSL certificate setup

DOMAIN="elogs.yourdomain.com"

# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d "$DOMAIN" --email admin@yourdomain.com --agree-tos --non-interactive

# Setup automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# Test SSL configuration
sudo certbot renew --dry-run
```

### Security Headers Configuration
```apache
# /etc/apache2/conf-available/security.conf
# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options SAMEORIGIN
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), camera=(), microphone=()"

# CSP Header
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com ajax.googleapis.com; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; img-src 'self' data:; font-src 'self' fonts.googleapis.com fonts.gstatic.com;"

# Hide server information
ServerTokens Prod
ServerSignature Off

# Disable TRACE method
TraceEnable off
```

### Firewall Configuration
```bash
#!/bin/bash
# setup-firewall.sh

# Enable UFW
sudo ufw enable

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow MySQL (only from specific IPs)
sudo ufw allow from 10.0.0.0/8 to any port 3306

# Rate limiting for SSH
sudo ufw limit ssh

# Application-specific rules
sudo ufw allow from 192.168.1.0/24 to any port 22 comment "Admin network SSH"

# Enable logging
sudo ufw logging on

# Status
sudo ufw status verbose
```

## Performance Optimization

### Database Optimization
```sql
-- /etc/mysql/mysql.conf.d/performance.cnf
[mysqld]
# Memory settings
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M
innodb_flush_log_at_trx_commit = 2

# Connection settings
max_connections = 200
thread_cache_size = 16

# Query cache
query_cache_type = 1
query_cache_size = 256M
query_cache_limit = 4M

# Temporary tables
tmp_table_size = 256M
max_heap_table_size = 256M

# Binary logging
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 7
```

### PHP Optimization
```ini
; /etc/php/7.4/apache2/conf.d/99-performance.ini

; Memory and execution
memory_limit = 512M
max_execution_time = 300
max_input_time = 300

; File uploads
file_uploads = On
upload_max_filesize = 10M
post_max_size = 12M
max_file_uploads = 20

; Session settings
session.gc_probability = 1
session.gc_divisor = 100
session.gc_maxlifetime = 28800

; OPcache settings
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 10000
opcache.validate_timestamps = 0
opcache.save_comments = 0
opcache.fast_shutdown = 1
```

### Apache Performance Tuning
```apache
# /etc/apache2/mods-available/mpm_prefork.conf
<IfModule mpm_prefork_module>
    StartServers             8
    MinSpareServers          5
    MaxSpareServers         20
    ServerLimit            256
    MaxRequestWorkers      256
    MaxConnectionsPerChild 10000
</IfModule>

# /etc/apache2/mods-available/deflate.conf
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML and fonts
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
    AddOutputFilterByType DEFLATE application/x-font
    AddOutputFilterByType DEFLATE application/x-font-opentype
    AddOutputFilterByType DEFLATE application/x-font-otf
    AddOutputFilterByType DEFLATE application/x-font-truetype
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE font/opentype
    AddOutputFilterByType DEFLATE font/otf
    AddOutputFilterByType DEFLATE font/ttf
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE image/x-icon
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
</IfModule>
```

## Monitoring & Logging

### Application Monitoring
```bash
#!/bin/bash
# monitor.sh - Application monitoring script

LOG_FILE="/var/log/elogs/monitor.log"
ALERT_EMAIL="admin@yourdomain.com"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

check_website() {
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://elogs.yourdomain.com/")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://elogs.yourdomain.com/")
    
    if [ "$HTTP_STATUS" != "200" ]; then
        log_message "ALERT: Website down (HTTP $HTTP_STATUS)"
        echo "Website is down (HTTP $HTTP_STATUS)" | mail -s "ELogs Alert" "$ALERT_EMAIL"
    elif (( $(echo "$RESPONSE_TIME > 5" | bc -l) )); then
        log_message "WARNING: Slow response time (${RESPONSE_TIME}s)"
    else
        log_message "OK: Website responding (HTTP $HTTP_STATUS, ${RESPONSE_TIME}s)"
    fi
}

check_disk_space() {
    DISK_USAGE=$(df /var/www | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -gt 90 ]; then
        log_message "ALERT: Disk usage critical (${DISK_USAGE}%)"
        echo "Disk usage is ${DISK_USAGE}%" | mail -s "ELogs Disk Alert" "$ALERT_EMAIL"
    elif [ "$DISK_USAGE" -gt 80 ]; then
        log_message "WARNING: Disk usage high (${DISK_USAGE}%)"
    fi
}

check_services() {
    services=("apache2" "mysql")
    
    for service in "${services[@]}"; do
        if ! systemctl is-active --quiet "$service"; then
            log_message "ALERT: Service $service is down"
            echo "Service $service is down" | mail -s "ELogs Service Alert" "$ALERT_EMAIL"
            
            # Attempt to restart
            systemctl restart "$service"
            if systemctl is-active --quiet "$service"; then
                log_message "INFO: Service $service restarted successfully"
            fi
        fi
    done
}

# Run checks
check_website
check_disk_space
check_services

log_message "Monitor check completed"
```

### Log Rotation Configuration
```bash
# /etc/logrotate.d/elogs
/var/log/elogs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload apache2
    endscript
}

/var/log/apache2/elogs_*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload apache2
    endscript
}
```

## Backup & Recovery

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh - Automated backup script

BACKUP_DIR="/var/backups/elogs"
RETENTION_DAYS=30
S3_BUCKET="s3://your-backup-bucket/elogs"

# Database backup
backup_database() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/db_backup_$timestamp.sql"
    
    mysqldump -u backup_user -p$MYSQL_BACKUP_PASSWORD \
        --single-transaction \
        --routines \
        --triggers \
        wordpress > "$backup_file"
    
    gzip "$backup_file"
    
    # Upload to S3
    aws s3 cp "${backup_file}.gz" "$S3_BUCKET/database/"
    
    echo "Database backup completed: ${backup_file}.gz"
}

# Application files backup
backup_files() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/files_backup_$timestamp.tar.gz"
    
    tar -czf "$backup_file" \
        --exclude='*.log' \
        --exclude='cache/*' \
        --exclude='.git/*' \
        -C /var/www elogs
    
    # Upload to S3
    aws s3 cp "$backup_file" "$S3_BUCKET/files/"
    
    echo "Files backup completed: $backup_file"
}

# Cleanup old backups
cleanup_backups() {
    find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
    
    echo "Cleanup completed"
}

# Main backup process
mkdir -p "$BACKUP_DIR"
backup_database
backup_files
cleanup_backups

echo "Backup process completed at $(date)"
```

### Recovery Procedures
```bash
#!/bin/bash
# recovery.sh - Disaster recovery script

BACKUP_DIR="/var/backups/elogs"
APP_DIR="/var/www/elogs"

recover_from_backup() {
    local backup_date="$1"
    
    if [ -z "$backup_date" ]; then
        echo "Usage: recover_from_backup YYYYMMDD_HHMMSS"
        exit 1
    fi
    
    # Stop services
    systemctl stop apache2
    
    # Recover database
    if [ -f "$BACKUP_DIR/db_backup_${backup_date}.sql.gz" ]; then
        echo "Recovering database..."
        gunzip -c "$BACKUP_DIR/db_backup_${backup_date}.sql.gz" | mysql -u root -p wordpress
    fi
    
    # Recover files
    if [ -f "$BACKUP_DIR/files_backup_${backup_date}.tar.gz" ]; then
        echo "Recovering files..."
        cd /var/www
        tar -xzf "$BACKUP_DIR/files_backup_${backup_date}.tar.gz"
        chown -R www-data:www-data elogs
    fi
    
    # Start services
    systemctl start apache2
    
    echo "Recovery completed"
}

# List available backups
list_backups() {
    echo "Available backups:"
    ls -la "$BACKUP_DIR" | grep -E "(db_backup|files_backup)"
}

case "$1" in
    "list")
        list_backups
        ;;
    "recover")
        recover_from_backup "$2"
        ;;
    *)
        echo "Usage: $0 {list|recover} [backup_date]"
        exit 1
        ;;
esac
```

## Maintenance Procedures

### Regular Maintenance Tasks
```bash
#!/bin/bash
# maintenance.sh - Regular maintenance tasks

# System updates
update_system() {
    echo "Updating system packages..."
    apt update && apt upgrade -y
    apt autoremove -y
    apt autoclean
}

# Security updates
security_updates() {
    echo "Installing security updates..."
    unattended-upgrade
}

# Database maintenance
maintain_database() {
    echo "Optimizing database..."
    mysql -u root -p -e "
        USE wordpress;
        OPTIMIZE TABLE wp_posts;
        OPTIMIZE TABLE wp_postmeta;
        OPTIMIZE TABLE wp_users;
        OPTIMIZE TABLE wp_usermeta;
        OPTIMIZE TABLE wp_options;
    "
}

# Log cleanup
cleanup_logs() {
    echo "Cleaning up logs..."
    find /var/log -name "*.log" -mtime +7 -size +100M -exec truncate -s 0 {} \;
    journalctl --vacuum-time=7d
}

# SSL certificate renewal
renew_ssl() {
    echo "Checking SSL certificates..."
    certbot renew --quiet
}

# Performance monitoring
check_performance() {
    echo "Performance check:"
    echo "Load average: $(uptime | awk -F'load average:' '{print $2}')"
    echo "Memory usage: $(free -h | grep Mem | awk '{print $3"/"$2}')"
    echo "Disk usage: $(df -h / | tail -1 | awk '{print $5}')"
}

# Run maintenance tasks
echo "Starting maintenance at $(date)"
update_system
security_updates
maintain_database
cleanup_logs
renew_ssl
check_performance
echo "Maintenance completed at $(date)"
```

### Scheduled Maintenance Cron Jobs
```bash
# /etc/cron.d/elogs-maintenance

# Daily backup at 2 AM
0 2 * * * deploy /home/deploy/backup.sh

# Weekly maintenance on Sunday at 3 AM
0 3 * * 0 root /root/maintenance.sh

# Monitor every 5 minutes
*/5 * * * * deploy /home/deploy/monitor.sh

# SSL renewal check daily
0 12 * * * root /usr/bin/certbot renew --quiet

# Log rotation
0 0 * * * root /usr/sbin/logrotate /etc/logrotate.conf

# Database optimization weekly
0 4 * * 1 root mysql -u root -p wordpress -e "OPTIMIZE TABLE wp_posts, wp_postmeta, wp_users, wp_usermeta, wp_options;"
```

---

*Deployment guide maintained by Combilift DevOps Team*  
*For deployment support, contact: devops@combilift.net*
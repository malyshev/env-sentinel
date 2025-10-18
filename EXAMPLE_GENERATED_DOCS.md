# Environment Variables Configuration

This document describes all environment variables used in this application.

## Table of Contents

- [Application](#application)
- [Database](#database)
- [Cache](#cache)
- [Redis](#redis)
- [Email](#email)
- [Security](#security)
- [Storage](#storage)
- [Monitoring](#monitoring)
- [External APIs](#external-apis)
- [Development](#development)

---

## Application

Core application settings and behavior.
These variables control the fundamental application configuration
and must be properly set before deployment.

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `APP_NAME` | Application name displayed in logs and UI | `string` | Yes | - | - |
| `APP_ENV` | Application environment mode | `enum` | Yes | - | Allowed: development, staging, production |
| `APP_DEBUG` | Enable debug mode with verbose logging | `boolean` | No | `false` | - |
| `APP_URL` | Base URL of the application | `string` | Yes | - | - |
| `APP_PORT` | Port number for the application server | `number` | No | `3000` | Min: 1<br>Max: 65535 |
| `APP_FULL_URL` | Complete application URL with port | `string` | No | - | - |

## Database

Database connection and configuration settings.
All database-related variables including connection pooling.
Make sure to use secure passwords and proper SSL configuration in production.

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `DB_CONNECTION` | Database driver to use.<br>Supported drivers: mysql, postgresql, sqlite | `enum` | Yes | - | Allowed: mysql, postgresql, sqlite |
| `DB_HOST` | Database server hostname or IP address | `string` | Yes | - | - |
| `DB_PORT` | Database server port number | `number` | Yes | - | Min: 1<br>Max: 65535 |
| `DB_DATABASE` | Name of the database to connect to | `string` | Yes | - | - |
| `DB_USERNAME` | Database username for authentication | `string` | Yes | - | - |
| 🔒 `DB_PASSWORD` | Database password (keep secure!) | `string` | Yes | - | - |
| `DB_POOL_MIN` | Minimum number of connections in pool | `number` | No | `2` | Min: 1 |
| `DB_POOL_MAX` | Maximum number of connections in pool | `number` | No | `10` | Min: 1<br>Max: 100 |
| `DB_CONNECTION_STRING` | Complete database connection string | `string` | No | - | - |

## Cache

Caching system configuration

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `CACHE_DRIVER` | Cache storage driver | `enum` | Yes | - | Allowed: file, redis, memcached |
| `CACHE_PREFIX` | Prefix for all cache keys | `string` | No | `myapp:` | - |
| `CACHE_TTL` | Default cache time-to-live in seconds | `number` | No | `3600` | Min: 1 |

## Redis

Redis server connection settings

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `REDIS_HOST` | Redis server hostname | `string` | No | `127.0.0.1` | - |
| `REDIS_PORT` | Redis server port | `number` | No | `6379` | Min: 1<br>Max: 65535 |
| 🔒 `REDIS_PASSWORD` | Redis authentication password | `string` | No | - | - |
| `REDIS_DB` | Redis database number | `number` | No | `0` | Min: 0<br>Max: 15 |

## Email

Email service configuration

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `MAIL_MAILER` | Email delivery method | `enum` | Yes | - | Allowed: smtp, sendmail, mailgun, ses |
| `MAIL_HOST` | SMTP server hostname | `string` | No | - | - |
| `MAIL_PORT` | SMTP server port | `number` | No | `587` | Min: 1<br>Max: 65535 |
| `MAIL_USERNAME` | SMTP authentication username | `string` | No | - | - |
| 🔒 `MAIL_PASSWORD` | SMTP authentication password | `string` | No | - | - |
| `MAIL_ENCRYPTION` | SMTP encryption method | `enum` | No | `tls` | Allowed: tls, ssl, none |
| `MAIL_FROM_ADDRESS` | Default sender email address | `string` | Yes | - | - |
| `MAIL_FROM_NAME` | Default sender name | `string` | No | - | - |
| `MAIL_FROM_FULL` | Full sender address with name | `string` | No | - | - |

## Security

Authentication and security settings.
Critical security configuration for user authentication and session management.
All secret values must be kept secure and rotated regularly.

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| 🔒 `JWT_SECRET` | Secret key for JWT token signing (keep secure!).<br>Must be at least 32 characters long with high entropy.<br>Never commit this value to version control. | `string` | Yes | - | Min: 32 |
| `JWT_EXPIRES_IN` | JWT token expiration time | `string` | No | `24h` | - |
| `SESSION_DRIVER` | Session storage driver | `enum` | Yes | - | Allowed: file, redis, database |
| `SESSION_LIFETIME` | Session lifetime in minutes | `number` | No | `120` | Min: 1 |
| `SESSION_ENCRYPT` | Encrypt session data | `boolean` | No | `true` | - |
| `BCRYPT_ROUNDS` | Number of bcrypt hashing rounds | `number` | No | `12` | Min: 4<br>Max: 31 |

## Storage

File storage and upload configuration

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `FILESYSTEM_DRIVER` | File storage driver | `enum` | Yes | - | Allowed: local, s3, gcs |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 storage | `string` | No | - | - |
| 🔒 `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 storage | `string` | No | - | - |
| `AWS_DEFAULT_REGION` | AWS region for S3 bucket | `string` | No | `us-east-1` | - |
| `AWS_BUCKET` | S3 bucket name for file storage | `string` | No | - | - |
| `AWS_BUCKET_URL` | Full S3 bucket URL | `string` | No | - | - |
| `UPLOAD_MAX_SIZE` | Maximum file upload size in MB | `number` | No | `10` | Min: 1 |
| `ALLOWED_EXTENSIONS` | Comma-separated list of allowed file extensions | `string` | No | `jpg,jpeg,png,pdf,doc,docx` | - |

## Monitoring

Application monitoring and logging settings

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `LOG_CHANNEL` | Log channel driver | `enum` | Yes | - | Allowed: stack, single, daily, slack |
| `LOG_LEVEL` | Minimum log level | `enum` | No | `info` | Allowed: emergency, alert, critical, error, warning, notice, info, debug |
| 🔒 `SENTRY_DSN` | Sentry error tracking DSN | `string` | No | - | - |
| 🔒 `NEW_RELIC_LICENSE_KEY` | New Relic license key for APM | `string` | No | - | - |

## External APIs

Third-party service integrations

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `STRIPE_PUBLIC_KEY` | Stripe publishable key for payments | `string` | No | - | - |
| 🔒 `STRIPE_SECRET_KEY` | Stripe secret key for payments | `string` | No | - | - |
| 🔒 `GOOGLE_MAPS_API_KEY` | Google Maps API key for geocoding | `string` | No | - | - |
| 🔒 `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS | `string` | No | - | - |
| 🔒 `TWILIO_AUTH_TOKEN` | Twilio auth token for SMS | `string` | No | - | - |

## Development

Development and testing specific settings

| Variable | Description | Type | Required | Default | Constraints |
|----------|-------------|------|----------|---------|-------------|
| `TELESCOPE_ENABLED` | Enable Laravel Telescope debugging tool | `boolean` | No | `false` | - |
| `HORIZON_ENABLED` | Enable Laravel Horizon queue monitoring | `boolean` | No | `false` | - |
| `MOCK_EXTERNAL_APIS` | Mock external API calls in development | `boolean` | No | `true` | - |

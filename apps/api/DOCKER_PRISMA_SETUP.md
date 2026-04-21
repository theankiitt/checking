# Docker & Prisma Setup Guide

## Overview

This guide covers the Docker and Prisma configuration for the GharSamma API, including:
- Prisma ORM integration
- Upload volume persistence
- Production and development setups
- Image storage configuration

---

## 🐳 Docker Configuration

### Services Architecture

```
┌─────────────────────────────────────────────────┐
│              Docker Network                      │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Postgres │  │  Redis   │  │     API      │  │
│  │   :5432  │  │  :6379   │  │    :3001     │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                    │              │
│  ┌──────────┐  ┌──────────┐      │              │
│  │   Web    │  │  Admin   │      │              │
│  │   :4000  │  │  :4001   │──────┘              │
│  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────┘
```

### Volume Mounts

#### Production (`docker-compose.yml`)

| Volume | Service | Purpose | Mount Point |
|--------|---------|---------|-------------|
| `postgres_data` | postgres | PostgreSQL database | `/var/lib/postgresql/data` |
| `redis_data` | redis | Redis cache & sessions | `/data` |
| `api_uploads` | api | **Uploaded images** | `/app/uploads` |

#### Development (`docker-compose.dev.yml`)

| Volume | Service | Purpose | Mount Point |
|--------|---------|---------|-------------|
| `postgres_data_dev` | postgres | PostgreSQL database | `/var/lib/postgresql/data` |
| `redis_data_dev` | redis | Redis cache & sessions | `/data` |
| `api_uploads_dev` | api | **Uploaded images** | `/app/uploads` |
| `./apps/api:/app` | api | Hot reload (bind mount) | `/app` |

---

## 🗄️ Prisma Configuration

### Schema Location
- **File:** `apps/api/prisma/schema.prisma`
- **Models:** 20+ (User, Product, Category, Order, etc.)

### Prisma Commands

```bash
# Generate Prisma Client (run after schema changes)
pnpm db:generate

# Push schema changes to database (development)
pnpm db:push

# Run migrations (development)
pnpm db:migrate

# Open Prisma Studio (database GUI)
pnpm db:studio

# Seed database with initial data
pnpm db:seed
```

### Docker Prisma Setup

The Dockerfile includes Prisma generation in two stages:

1. **Builder Stage:** Generates Prisma Client before building
2. **Runner Stage:** Copies Prisma schema and generates Client for production

```dockerfile
# In builder stage
RUN pnpm db:generate
RUN pnpm build

# In runner stage
COPY prisma ./prisma/
RUN pnpm db:generate
```

### Environment Variables

```env
# Required for Prisma
DATABASE_URL=postgresql://gharsamma:gharsamma_password@postgres:5432/gharsamma

# Optional: Redis
REDIS_URL=redis://redis:6379

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
```

---

## 📸 Upload & Image Storage

### Upload Directory Structure

```
/app/uploads/
├── categories/      # Category images
├── brands/          # Brand logos
├── sliders/         # Slider images
├── media/           # General media
├── products/        # Product images (compressed)
└── splash-screens/  # Splash screen images
```

### How Uploads Work

1. **Multer** handles file uploads to disk
2. **Sharp** compresses product images (1920x1920, quality 80, JPEG)
3. Images stored in `/app/uploads` (persisted via Docker volume)
4. Served statically via Express: `app.use("/uploads", express.static(...))`

### Accessing Uploaded Images

**In Development:**
```
http://localhost:3001/uploads/products/image.jpg
```

**In Production:**
```
http://your-api-domain:3001/uploads/products/image.jpg
```

### Volume Persistence

✅ **Production:** Images persist across container restarts via `api_uploads` volume
✅ **Development:** Images persist via `api_uploads_dev` volume + bind mount

### Backup & Restore Uploads

**Backup:**
```bash
# Export uploads volume
docker run --rm \
  -v gharsamma-ecommerce_api_uploads:/source:ro \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup.tar.gz -C /source .
```

**Restore:**
```bash
# Import uploads volume
docker run --rm \
  -v gharsamma-ecommerce_api_uploads:/destination \
  -v $(pwd):/backup \
  alpine tar xzf /backup/uploads-backup.tar.gz -C /destination
```

---

## 🚀 Getting Started

### Development Mode

```bash
# Start all services with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f api

# Run Prisma migrations
docker exec -it gharsamma-api-dev pnpm db:migrate

# Generate Prisma Client
docker exec -it gharsamma-api-dev pnpm db:generate

# Open Prisma Studio
docker exec -it gharsamma-api-dev pnpm db:studio
```

### Production Mode

```bash
# Build and start all services
docker-compose up -d --build

# Run migrations (first time only)
docker exec -it gharsamma-api pnpm db:migrate

# Seed database (optional)
docker exec -it gharsamma-api pnpm db:seed

# View logs
docker-compose logs -f api
```

---

## 🔧 Troubleshooting

### Prisma Client Not Generated

**Error:** `@prisma/client` not found or schema mismatch

**Solution:**
```bash
# Regenerate Prisma Client
docker exec -it gharsamma-api pnpm db:generate

# If that fails, rebuild the container
docker-compose down
docker-compose up -d --build api
```

### Uploads Not Persisting

**Symptoms:** Images disappear after container restart

**Check:**
```bash
# Verify volume exists
docker volume ls | grep api_uploads

# Check volume contents
docker run --rm -v gharsamma-ecommerce_api_uploads:/data alpine ls -la /data
```

**Fix:**
```bash
# Ensure volume is mounted correctly
docker-compose down
docker-compose up -d
```

### Database Connection Issues

**Error:** Can't connect to PostgreSQL

**Check:**
```bash
# Verify database is running
docker ps | grep postgres

# Test connection
docker exec -it gharsamma-api ping postgres
```

**Fix:**
```bash
# Check DATABASE_URL in environment
docker inspect gharsamma-api | grep DATABASE_URL

# Restart services in correct order
docker-compose down
docker-compose up -d postgres redis api web admin
```

### Permission Issues with Uploads

**Error:** EACCES permission denied on /app/uploads

**Solution:**
```bash
# Fix permissions inside container
docker exec -it gharsamma-api chown -R nodejs:nodejs /app/uploads

# Or rebuild with updated Dockerfile
docker-compose up -d --build api
```

---

## 📊 Volume Management

### List All Volumes

```bash
docker volume ls | grep gharsamma
```

### Inspect Volume

```bash
docker inspect gharsamma-ecommerce_api_uploads
```

### Remove Volumes (⚠️ Warning: Deletes data)

```bash
# Remove specific volume
docker volume rm gharsamma-ecommerce_api_uploads

# Remove all project volumes
docker-compose down -v
```

### Check Volume Size

```bash
# Check all volumes
docker system df -v

# Check specific volume
docker run --rm -v gharsamma-ecommerce_api_uploads:/data alpine du -sh /data
```

---

## 🔐 Security Considerations

### Production Checklist

- [ ] Change default `JWT_SECRET`
- [ ] Change default PostgreSQL password
- [ ] Set strong `REDIS_URL` with authentication (if needed)
- [ ] Use environment-specific `.env` files (not committed)
- [ ] Don't expose PostgreSQL/Redis ports to host (remove `ports` if not needed)
- [ ] Use Docker secrets for sensitive data (optional)
- [ ] Enable HTTPS for API endpoints
- [ ] Regular volume backups

### Environment Variables (Production)

Create `.env` file in project root:

```env
# PostgreSQL
POSTGRES_USER=gharsamma_prod
POSTGRES_PASSWORD=<strong-random-password>
POSTGRES_DB=gharsamma

# Database URL (used by API)
DATABASE_URL=postgresql://gharsamma_prod:<strong-random-password>@postgres:5432/gharsamma

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=<long-random-string-at-least-32-chars>

# Cloudinary (optional, if using cloud storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📈 Performance Optimization

### Docker Compose Production Tips

1. **Resource Limits** (add to docker-compose.yml):
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

2. **Health Checks:** Already configured, ensure they pass
3. **Restart Policy:** Set to `unless-stopped` (already configured)
4. **Logging:** Configure log rotation to prevent disk fill

### Prisma Performance

- Use connection pooling (Prisma does this automatically)
- Select only needed fields in queries
- Use `.take()` and `.skip()` for pagination
- Index frequently queried fields in schema

---

## 📝 Common Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build api

# View logs
docker-compose logs -f api
docker-compose logs -f --tail=100 api

# Execute command in running container
docker exec -it gharsamma-api sh
docker exec -it gharsamma-api pnpm db:studio

# Restart specific service
docker-compose restart api

# Scale services (if needed)
docker-compose up -d --scale api=3

# Clean up unused images/volumes
docker system prune -a
docker volume prune
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start dev environment | `docker-compose -f docker-compose.dev.yml up -d` |
| Start production | `docker-compose up -d` |
| Run migrations | `docker exec -it gharsamma-api pnpm db:migrate` |
| Generate Prisma Client | `docker exec -it gharsamma-api pnpm db:generate` |
| Open Prisma Studio | `docker exec -it gharsamma-api pnpm db:studio` |
| Seed database | `docker exec -it gharsamma-api pnpm db:seed` |
| View API logs | `docker-compose logs -f api` |
| Check upload volume | `docker run --rm -v gharsamma-ecommerce_api_uploads:/data alpine ls -la /data` |
| Stop everything | `docker-compose down` |
| Stop + delete volumes | `docker-compose down -v` ⚠️ |

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

---

**Last Updated:** April 8, 2026  
**Status:** ✅ Production Ready

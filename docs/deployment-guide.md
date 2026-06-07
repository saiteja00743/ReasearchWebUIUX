# Deployment Guide

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster
- Redis instance such as Upstash
- Cloudinary account
- Vercel account
- Google OAuth credentials
- Email provider for verification and password reset

## API Deployment

The Express API can be deployed to Render, Railway, Fly.io, or a Vercel serverless adapter. For clean long-running connections, a Node host is recommended.

Required environment variables:

- `MONGODB_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `APP_URL`
- `API_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Web Deployment on Vercel

1. Import the repository into Vercel.
2. Set root command to use the `apps/web` workspace.
3. Add `NEXT_PUBLIC_API_URL`.
4. Add `NEXT_PUBLIC_APP_URL`.
5. Add OAuth and AdSense values when enabled.
6. Deploy preview, test core flows, then promote to production.

## MongoDB Atlas

- Enable IP access for deployment host.
- Create database user with least privilege.
- Enable backups.
- Monitor slow queries and add indexes from `docs/database-schema.md`.

## Cloudinary

- Use signed uploads for PDFs and cover images.
- Restrict PDF max size.
- Validate MIME type server-side.
- Store `public_id` and secure URL in MongoDB.

## Redis

- Cache discovery feeds for 60 seconds.
- Cache publication detail pages for public traffic.
- Use Redis-backed rate limiting for multi-instance deployments.

## Production Checklist

- Strong JWT secrets
- HTTPS-only cookies for refresh tokens
- File scanning for PDFs
- Cloudinary upload route protected by auth and MIME validation
- Error monitoring
- Analytics events
- Admin audit logs
- Sitemap submission
- Open Graph preview testing
- Backup and restore test

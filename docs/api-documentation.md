# API Documentation

Base URL: `/api/v1`

## Auth

### POST `/auth/register`

Creates a student account and queues email verification.

```json
{
  "name": "Aarav Mehta",
  "username": "aarav",
  "email": "aarav@example.com",
  "password": "strongpassword"
}
```

### POST `/auth/login`

Returns `accessToken`, `refreshToken`, and public user data.

### POST `/auth/google`

Google OAuth callback endpoint. Intended to verify Google identity token and create or link the user.

### POST `/auth/forgot-password`

Queues a reset email.

### POST `/auth/verify-email`

Verifies email token.

### POST `/auth/refresh`

Accepts a refresh token, checks the hashed session record, and returns a new short-lived access token.

### POST `/auth/logout`

Revokes the refresh-token session.

## Uploads

### POST `/uploads`

Requires JWT. Multipart upload field: `file`.

Allowed file types:

- `application/pdf`
- `image/jpeg`
- `image/png`
- `image/webp`

Returns Cloudinary `url`, `publicId`, `type`, and byte size.

## Publications

### GET `/publications`

Query params:

- `q`: keyword search
- `category`: category filter
- `sort`: `latest`, `trending`, `downloads`

### GET `/publications/:slug`

Returns public publication data and increments view count.

### POST `/publications`

Requires JWT. Creates a draft or review-ready publication.

```json
{
  "title": "Student Placement Prediction Using Machine Learning",
  "abstract": "Long academic abstract...",
  "keywords": ["machine learning", "placement", "education"],
  "tags": ["AI", "Python"],
  "category": "Artificial Intelligence",
  "authors": [{ "name": "Aarav Mehta", "affiliation": "PES University" }],
  "pdfUrl": "https://res.cloudinary.com/demo/raw/upload/report.pdf",
  "pdfPublicId": "researchhub/reports/report",
  "status": "in_review"
}
```

### PATCH `/publications/:id/review`

Requires reviewer or admin role. Updates status, rejection reason, and review metadata.

### POST `/publications/:id/like`

Requires JWT. Toggles like.

### POST `/publications/:id/bookmark`

Requires JWT. Toggles bookmark.

### POST `/publications/:id/download`

Records download analytics.

## Users

### GET `/users/:username`

Returns public profile, social links, followers, following, and published papers.

### PATCH `/users/me`

Requires JWT. Updates profile photo, bio, skills, and social links.

### POST `/users/:username/follow`

Requires JWT. Toggles follow.

## AI

### POST `/ai/generate`

Requires JWT.

Supported types:

- `abstract`
- `keywords`
- `summary`
- `citation`

## Admin

All admin endpoints require `admin` role.

- GET `/admin/analytics`
- GET `/admin/users`
- GET `/admin/publications/review`

## Security

- JWT access tokens with short TTL
- Refresh token sessions stored as hashes
- Rate limiting on global and auth routes
- Zod request validation
- RBAC middleware
- Cloudinary-only file persistence
- PDF/image validation should be enforced before upload signing in production

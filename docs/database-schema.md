# Database Schema

ResearchHub uses MongoDB Atlas with Mongoose models and targeted indexes for discovery, author pages, admin review queues, and analytics.

## Users

| Field | Type | Notes |
| --- | --- | --- |
| name | string | Required |
| username | string | Unique, lowercase, indexed |
| email | string | Unique, lowercase, indexed |
| passwordHash | string | Optional for OAuth-only users |
| role | enum | student, reviewer, admin |
| avatarUrl | string | Cloudinary URL |
| university | string | Optional affiliation |
| bio | string | 500 char max |
| skills | string[] | Profile discovery |
| socialLinks | object[] | LinkedIn, GitHub, portfolio |
| followers | ObjectId[] | User refs |
| following | ObjectId[] | User refs |
| emailVerifiedAt | date | Email verification state |
| resetTokenHash | string | Password reset |

## Publications

| Field | Type | Notes |
| --- | --- | --- |
| title | string | Required |
| slug | string | Unique permanent URL |
| abstract | string | Required |
| summary | string | AI-generated optional summary |
| keywords | string[] | Indexed |
| tags | string[] | Indexed |
| category | string | Indexed |
| authors | object[] | Name, email, affiliation, optional user ref |
| owner | ObjectId | User ref, indexed |
| pdfUrl | string | Cloudinary secure URL |
| pdfPublicId | string | Cloudinary public id |
| coverImageUrl | string | Optional |
| citation | string | Generated citation text |
| status | enum | draft, in_review, published, rejected, removed |
| featuredUntil | date | Revenue system |
| sponsoredBy | string | Sponsored university |
| metrics | object | views, downloads, likes, bookmarks, shares |
| publishedAt | date | Public ordering |

## Sessions

| Field | Type | Notes |
| --- | --- | --- |
| user | ObjectId | User ref |
| refreshTokenHash | string | Unique |
| userAgent | string | Device visibility |
| ipAddress | string | Security auditing |
| expiresAt | date | TTL index |
| revokedAt | date | Logout and compromise handling |

## Interactions

| Field | Type | Notes |
| --- | --- | --- |
| user | ObjectId | User ref |
| publication | ObjectId | Publication ref |
| type | enum | like, bookmark, download, share, view |

Unique index: `{ user, publication, type }`.

## Index Strategy

- Full-text search on `title`, `abstract`, `keywords`, and `tags`
- Compound publication browsing index on `{ status, category, publishedAt }`
- Trending indexes on `metrics.views` and `metrics.downloads`
- User lookup by `username` and `email`
- Admin review queue by `status`

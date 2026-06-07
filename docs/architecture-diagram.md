# Architecture Diagram

```mermaid
flowchart LR
  Student["Student / Author"] --> Web["Next.js 15 Web App"]
  Recruiter["Recruiter / Public Visitor"] --> Web
  Admin["Admin / Reviewer"] --> Web

  Web --> API["Express API"]
  Web --> Vercel["Vercel Edge / CDN"]

  API --> Mongo["MongoDB Atlas"]
  API --> Redis["Redis Cache"]
  API --> Cloudinary["Cloudinary PDF + Image Storage"]
  API --> Email["Email Provider"]
  API --> AI["AI Provider"]
  API --> Ads["AdSense + Revenue Services"]

  Mongo --> Analytics["Publication Analytics"]
  Redis --> Discovery["Trending + Search Cache"]
```

## Runtime Responsibilities

- Next.js renders public SEO pages, authenticated dashboards, and publishing flows.
- Express owns auth, publication workflows, analytics mutations, admin actions, AI calls, and file metadata.
- MongoDB Atlas stores user, publication, session, interaction, payment, and sponsorship state.
- Redis caches discovery lists, publication pages, and rate-sensitive analytics.
- Cloudinary stores PDFs and cover images with validation and transformation support.
- Vercel hosts the web app and edge-caches public pages.

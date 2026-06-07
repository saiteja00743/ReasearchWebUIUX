# ResearchHub

**The easiest way for students to publish and showcase research, projects, and technical articles.**

ResearchHub is a production-oriented SaaS starter for student research publishing. It gives students free publication pages, permanent public links, profiles, discovery, analytics, AI writing assistance, and monetization paths through ads, premium memberships, featured publications, and sponsored university programs.

## What Is Included

- Next.js 15 web app with TypeScript, Tailwind CSS, and shadcn-style UI primitives
- Express.js API with MongoDB models, JWT auth, refresh-token sessions, validation, rate limiting, RBAC, Cloudinary uploads, and Redis cache helpers
- Public publication pages, discovery, dashboard, publishing flow, auth screens, profile pages, and admin foundation
- AI service abstraction for abstract, keywords, summary, and citation generation
- SEO utilities, sitemap route, Open Graph metadata, and JSON-LD structured data
- Architecture, ER diagram, API docs, wireframes, design system, deployment guide, pitch deck, investor presentation, business model canvas, launch plan, LinkedIn strategy, and 30-day growth strategy

## Folder Structure

```txt
researchhub/
  apps/
    api/                  Express API, MongoDB models, controllers, services
    web/                  Next.js 15 frontend
  packages/
    shared/               Shared constants, types, validators
  docs/                   Product, technical, launch, and fundraising docs
```

## Quick Start

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:api
npm run dev
```

Web: `http://localhost:3000`  
API: `http://localhost:4000/api/v1`

## Environment

See [API env](apps/api/.env.example) and [Web env](apps/web/.env.example).

## Core Commands

```bash
npm run dev
npm run dev:api
npm run build
npm run lint
npm run typecheck
```

## Documentation

- [Database Schema](docs/database-schema.md)
- [API Documentation](docs/api-documentation.md)
- [Architecture Diagram](docs/architecture-diagram.md)
- [Database ER Diagram](docs/database-er-diagram.md)
- [Wireframes](docs/wireframes.md)
- [UI Design System](docs/ui-design-system.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Startup Pitch Deck](docs/startup-pitch-deck.md)
- [Investor Presentation](docs/investor-presentation.md)
- [Business Model Canvas](docs/business-model-canvas.md)
- [Product Launch Plan](docs/product-launch-plan.md)
- [LinkedIn Launch Strategy](docs/linkedin-launch-strategy.md)
- [30-Day Growth Strategy](docs/30-day-growth-strategy.md)

## Production Notes

This scaffold is intentionally built like a startup foundation: clear product surfaces, typed contracts, separated API/web concerns, security middleware, revenue hooks, analytics primitives, and docs that help a small team move fast without losing the plot.

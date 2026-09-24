# Sunesis v3

Sunesis v3 is a TypeScript recreation of the Sunesis learning workspace, built with Next.js, React, and Tailwind CSS. It includes authentication screens, topic and slide management, presentation views, and a persistent writing board.

## Features

- Landing page with sign-in and registration flows
- Password reset and email verification states
- Authenticated workspace with account controls
- Topic and slide content management
- Slide presentation and web-based content views
- Writing board with saved entries, formatting controls, and theme options
- Reusable shared components and typed client-side storage helpers
- Reused Sunesis visual assets in `public/images`

## Requirements

- Node.js 18.18 or later
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the Next.js development server |
| `npm run build` | Create a production build            |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run the configured lint command      |

## Routes

| Route             | Purpose                                 |
| ----------------- | --------------------------------------- |
| `/`               | Landing page and authentication         |
| `/account`        | Account details and session controls    |
| `/slide-admin`    | Manage topics and slides                |
| `/slide-view`     | View slide-based content                |
| `/web-view`       | View content as a web page              |
| `/board`          | Create and manage writing board entries |
| `/footer-pages`   | Footer-linked information pages         |
| `/reset-password` | Password reset state                    |
| `/verify-email`   | Email verification state                |

## Project structure

```text
app/          Next.js App Router pages and global styles
components/   Shared React UI components
lib/          Typed models, storage helpers, and utilities
public/images Reused Sunesis image assets
```

## Data and authentication

The frontend remains usable without a backend for local development: users, topics, slides, and board entries are stored in browser storage. Authentication state uses session storage with an optional remembered-user value in local storage.

The separate `S-v3 Backend` service provides PostgreSQL-backed persistence and JWT authentication for deployment. Set `NEXT_PUBLIC_API_URL` in `.env.local` to the deployed API URL when wiring the production client to the backend.

## Vercel deployment

Deploy this directory as a Vercel project using the default Next.js settings. Add `NEXT_PUBLIC_API_URL` as a production environment variable if the deployed frontend should use the backend service.

The original `sunesis` project is kept separate and is not modified by this repository.

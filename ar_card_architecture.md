# Lightweight AR Card Web System Architecture

*Last updated: 2026-03-11*

## Goals

-   Extremely lightweight architecture
-   Minimal infrastructure cost
-   Easy deployment
-   Maintainable structure following basic SOLID principles
-   Works well on mobile browsers
-   Easily convertible into a mobile app later

------------------------------------------------------------------------

# 1. System Overview

This project contains two main parts:

1.  **Admin Panel**
2.  **AR Interaction Page**

Architecture overview:

                    +----------------------+
                    |     Admin Panel      |
                    |     (Next.js)        |
                    +----------+-----------+
                               |
                               |
                        REST API
                               |
                +--------------v-------------+
                |        Backend API         |
                |         (NestJS)           |
                +--------------+-------------+
                               |
              +----------------+----------------+
              |                                 |
    +---------v---------+             +---------v-----------+
    |     PostgreSQL    |             |     File Storage    |
    |    (Supabase)     |             |  Cloudflare R2 /    |
    |                   |             |   Supabase Storage  |
    +-------------------+             +---------------------+
                               |
                               |
                    +----------v-----------+
                    |     AR Web Client    |
                    |  MindAR + Three.js   |
                    +----------------------+

------------------------------------------------------------------------

# 2. Technology Stack

## Frontend

Framework:

-   **Next.js (App Router)**
-   **TypeScript**
-   **TailwindCSS**

Libraries:

-   **Three.js** → 3D rendering
-   **MindAR.js** → marker-based AR tracking
-   **react-three-fiber (optional)** → easier Three.js usage

Deployment:

-   **Vercel**

------------------------------------------------------------------------

## Backend

Framework:

-   **NestJS (TypeScript)**

Features:

-   REST API
-   File upload
-   QR code generation
-   Authentication for admin

Deployment:

-   **Railway**
-   or **Render**

------------------------------------------------------------------------

## Database

Database:

-   **PostgreSQL**

Recommended provider:

-   **Supabase**

Advantages:

-   free tier
-   simple dashboard
-   built-in authentication if needed

------------------------------------------------------------------------

## File Storage

Used for:

-   3D model files
-   marker images
-   generated QR codes

Options:

-   **Cloudflare R2** (recommended)
-   **Supabase Storage**

Advantages:

-   CDN distribution
-   cheap
-   fast global delivery

------------------------------------------------------------------------

# 3. Database Schema

## Table: cards

  column        type
  ------------- -----------
  id            uuid
  name          text
  description   text
  model_url     text
  marker_url    text
  zoom_limit    float
  created_by    text
  updated_by    text
  created_at    timestamp
  updated_at    timestamp

------------------------------------------------------------------------

## Table: users

  column          type
  --------------- -----------
  id              uuid
  username        text
  password_hash   text
  role            text
  created_at      timestamp

------------------------------------------------------------------------

# 4. Admin Panel Features

Admin functions:

### Card management

-   Create card
-   Edit card
-   Delete card
-   View card details

### Upload 3D model

Supported format:

    GLB / GLTF (recommended)

When uploaded:

1.  File stored in Storage
2.  model_url updated in database

------------------------------------------------------------------------

### QR Code Generation

Each card will generate a QR containing:

    https://yourdomain.com/ar?id=CARD_ID

QR code can be:

-   downloaded
-   printed

------------------------------------------------------------------------

# 5. AR Interaction Page

Main page of the website.

Features:

-   Access device camera
-   Detect marker (QR or custom marker)
-   Load 3D model
-   Render object on marker plane
-   Allow user interaction

User interactions:

-   rotate object
-   zoom object (limited by zoom_limit)
-   scale object

------------------------------------------------------------------------

# 6. AR Flow

    User scans QR
         ↓
    Open URL
         ↓
    /ar?id=123
         ↓
    Frontend calls API
         ↓
    GET /api/cards/123
         ↓
    Receive metadata + model_url
         ↓
    Load GLB model
         ↓
    MindAR detects marker
         ↓
    Three.js renders object

------------------------------------------------------------------------

# 7. Backend Project Structure

    src
     ├ modules
     │   ├ cards
     │   │   ├ cards.controller.ts
     │   │   ├ cards.service.ts
     │   │   ├ cards.repository.ts
     │   │   └ dto
     │   │
     │   ├ upload
     │   │   └ upload.service.ts
     │   │
     │   └ auth
     │
     ├ common
     │   ├ guards
     │   ├ middleware
     │   └ utils
     │
     └ main.ts

------------------------------------------------------------------------

# 8. Frontend Project Structure

    src
     ├ app
     │   ├ admin
     │   │   ├ cards
     │   │   │   ├ page.tsx
     │   │   │   └ [id]
     │   │
     │   └ ar
     │       └ page.tsx
     │
     ├ components
     │   ├ ui
     │   └ ar
     │
     ├ services
     │   └ api.ts
     │
     └ types

------------------------------------------------------------------------

# 9. Deployment Strategy

Frontend:

    Vercel

Backend:

    Railway / Render

Database:

    Supabase

Storage:

    Cloudflare R2

Deployment flow:

    Git push
     → auto build
     → auto deploy

------------------------------------------------------------------------

# 10. Performance Recommendations

### 3D Model Size

Recommended:

    < 5MB

------------------------------------------------------------------------

### Compression

Use:

    Draco compression

------------------------------------------------------------------------

### Texture Resolution

Recommended:

    512px or 1024px

------------------------------------------------------------------------

# 11. Mobile App Conversion

Later the web project can become a mobile app using:

### Option 1 (recommended)

    Capacitor

Convert web → Android / iOS

------------------------------------------------------------------------

### Option 2

    React Native WebView

------------------------------------------------------------------------

# 12. Estimated Development Time

  Module           Time
  ---------------- --------
  Admin CRUD       2 days
  Upload system    1 day
  AR viewer        3 days
  3D interaction   2 days
  Deploy           1 day

Estimated total:

**7--10 days for MVP**

------------------------------------------------------------------------

# 13. Future Improvements

Possible upgrades:

-   analytics tracking (scan count)
-   multiple markers
-   animation support in GLB
-   user generated cards
-   social sharing

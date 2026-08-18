# ARCard - Technical Specification Document

## Project Overview

**Project Name:** ARCard  
**Project Type:** Web Application (AR Experience Platform)  
**Core Functionality:** A platform that allows users to create AR (Augmented Reality) experiences by linking physical cards to 3D digital content. Users scan QR codes on cards to view 3D models in their browser.  
**Target Users:** 
- **Admins:** Marketing teams, event organizers, product designers who create AR experiences
- **End Users:** Consumers who scan cards to view AR content

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ARCard System                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  Admin Panel │     │   AR Client  │     │  QR Scanner  │    │
│  │  (Next.js)   │     │  (Next.js +  │     │  (Browser)   │    │
│  │              │     │   MindAR)    │     │              │    │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘    │
│         │                   │                    │             │
│         └───────────────────┼────────────────────┘             │
│                             │                                  │
│                      ┌──────▼───────┐                         │
│                      │  Backend API │                         │
│                      │   (NestJS)   │                         │
│                      └──────┬───────┘                         │
│                             │                                  │
│         ┌───────────────────┼───────────────────┐              │
│         │                   │                   │              │
│  ┌──────▼───────┐    ┌──────▼───────┐    ┌──────▼───────┐    │
│  │  PostgreSQL  │    │   Storage    │    │  QR Code    │    │
│  │  (Supabase)  │    │ (Cloudflare │    │  Service     │    │
│  │              │    │     R2)      │    │              │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Backend | NestJS | 10.x |
| Database | PostgreSQL (Supabase) | 15.x |
| ORM | Prisma | 5.x |
| Admin Panel | Next.js | 14.x |
| AR Engine | MindAR | 3.x |
| 3D Rendering | Three.js | 0.160.x |
| UI Framework | TailwindCSS | 3.x |
| File Storage | Cloudflare R2 | - |
| Authentication | JWT | - |

---

## Database Schema

### Tables

#### 1. `User` - Admin Users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| name | VARCHAR(255) | NULL | Display name |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

#### 2. `Card` - AR Cards
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Card title |
| description | TEXT | NULL | Card description |
| markerImage | VARCHAR(500) | NOT NULL | Path to marker image (R2 URL) |
| targetModel | VARCHAR(500) | NOT NULL | Path to 3D model (R2 URL) |
| modelScale | FLOAT | DEFAULT 1.0 | 3D model scale |
| zoomLimit | FLOAT | DEFAULT 2.0 | Maximum zoom multiplier |
| qrCode | VARCHAR(500) | NULL | Generated QR code URL |
| isActive | BOOLEAN | DEFAULT true | Card visibility |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login | Login user | Public |
| POST | /api/auth/register | Register new admin | Public |
| GET | /api/auth/profile | Get current user | JWT |

### Cards Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/cards | List all cards | JWT |
| GET | /api/cards/:id | Get card by ID | JWT |
| POST | /api/cards | Create new card | JWT |
| PUT | /api/cards/:id | Update card | JWT |
| DELETE | /api/cards/:id | Delete card | JWT |
| GET | /api/cards/:id/ar | Get AR view data | Public |

### File Upload
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/upload | Upload file (image/model) | JWT |
| DELETE | /api/upload/:filename | Delete uploaded file | JWT |

---

## Functionality Specification

### 1. Authentication Module

#### Features:
- User registration with email/password
- JWT-based authentication
- Password hashing with bcrypt
- Token refresh mechanism

#### Data Flow:
```
User Login → Validate Credentials → Generate JWT → Return Token
```

### 2. Card Management Module

#### Features:
- Create AR card with title, description
- Upload marker image (PNG/JPG, max 5MB)
- Upload 3D model (GLB/GLTF, max 20MB)
- Configure model scale (0.1 - 5.0)
- Configure zoom limit (1.0 - 10.0)
- Auto-generate QR code linking to AR view
- Toggle card active/inactive status
- List view with search/filter

#### Data Flow:
```
Admin Upload → Validate File → Upload to R2 → Save to Database → Generate QR → Return Card
```

### 3. AR Viewer Module

#### Features:
- Browser-based AR experience (no app required)
- Camera permission handling
- Marker detection using MindAR
- 3D model rendering with Three.js
- Touch gestures (pinch to zoom, rotate)
- Loading state with progress indicator
- Error handling for camera/model failures

#### Data Flow:
```
User Scan QR → Open AR Page → Request Camera → Detect Marker → Load 3D Model → Display AR
```

### 4. File Upload Service

#### Features:
- Support image formats: PNG, JPG, JPEG
- Support 3D model formats: GLB, GLTF
- File size validation
- File type validation
- Cloudflare R2 storage integration

---

## UI/UX Specification

### Admin Panel Pages

#### 1. Login Page
- Email input field
- Password input field
- Login button
- "Forgot password" link (future)

#### 2. Dashboard
- Welcome message with user name
- Quick stats (total cards, active cards)
- Recent cards list
- Quick actions

#### 3. Cards List Page
- Table with columns: Title, Status, Created, Actions
- Search bar
- "Create New Card" button
- Pagination

#### 4. Card Create/Edit Page
- Form fields:
  - Title (text input)
  - Description (textarea)
  - Marker Image (file upload with preview)
  - 3D Model (file upload with preview)
  - Model Scale (number input with range slider)
  - Zoom Limit (number input with range slider)
  - Active toggle
- Save/Cancel buttons

#### 5. Card Detail Page
- View all card information
- QR code display (downloadable)
- AR preview link
- Edit/Delete actions

### AR Client Pages

#### AR Viewer Page
- Full-screen camera view
- 3D model overlay on marker
- Loading indicator during model load
- Error overlay for camera/load failures
- "View in fullscreen" button (optional)

---

## Component Specifications

### Card Form Component
```
Fields:
- title: required, max 255 chars
- description: optional, max 1000 chars
- markerImage: required, image/png|jpg|jpeg, max 5MB
- targetModel: required, model/gltf-binary, max 20MB
- modelScale: number, range 0.1-5.0, default 1.0
- zoomLimit: number, range 1.0-10.0, default 2.0
- isActive: boolean, default true
```

### QR Code Generation
- Format: PNG image
- Size: 300x300 pixels
- Content: `{AR_CLIENT_URL}/ar/{cardId}`
- Error correction: High (H)

### AR Viewer Component
- MindAR image-tracking configuration
- Three.js scene setup
- OrbitControls with configurable limits
- GLTFLoader for model loading
- Loading progress tracking

---

## Security Specifications

### Authentication
- JWT secret minimum 256 bits
- Token expiration: 24 hours
- Password minimum 8 characters
- Rate limiting on auth endpoints

### File Upload
- Allowed mime types whitelist
- File size limits enforced
- Filename sanitization
- R2 bucket CORS configuration

### API Security
- CORS allowed origins configured
- Helmet.js for security headers
- Class-validator for input validation

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=24h
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=arcard-assets
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
PORT=3000
```

### Admin Panel (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_AR_CLIENT_URL=http://localhost:3001
```

### AR Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Deployment Configuration

### Production URLs (Example)
```
Backend API: https://api.arcard.app
Admin Panel: https://admin.arcard.app
AR Client: https://arcard.app
```

### Recommended Services
| Service | Purpose | Alternative |
|---------|---------|-------------|
| Railway/Render | Backend hosting | DigitalOcean, VPS |
| Vercel | Frontend hosting | Netlify |
| Supabase | Database | Neon, PlanetScale |
| Cloudflare R2 | File storage | AWS S3, UploadThing |

---

## Development Workflow

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Cloudflare account with R2 bucket

### Local Development Setup
1. Clone repository
2. Install dependencies for each project
3. Configure environment variables
4. Run database migrations
5. Start backend server
6. Start frontend applications

### Testing Checklist
- [ ] User registration and login
- [ ] Card CRUD operations
- [ ] File upload (image and 3D model)
- [ ] QR code generation
- [ ] AR marker detection
- [ ] 3D model rendering
- [ ] Touch interactions (zoom, rotate)
- [ ] Error handling

---

## Milestones

### Phase 1: Backend Foundation (Day 1-2)
- [x] NestJS project structure
- [x] Prisma schema setup
- [x] Authentication module
- [x] Cards CRUD API
- [x] File upload service

### Phase 2: Admin Panel (Day 3-4)
- [x] Next.js setup with TailwindCSS
- [x] Authentication pages
- [x] Dashboard
- [x] Card management UI
- [x] File upload component

### Phase 3: AR Client (Day 5-7)
- [x] Next.js AR page setup
- [x] MindAR integration
- [x] Three.js model rendering
- [x] Touch controls
- [x] Loading states

### Phase 4: Deployment (Day 8)
- [ ] Production deployment
- [ ] Domain configuration
- [ ] SSL setup
- [ ] End-to-end testing

---

## Future Improvements

- Multi-language support (i18n)
- Analytics dashboard (scan counts)
- Video texture support
- Multiple markers per card
- Custom branding (white-label)
- User management (multiple admins)
- WebXR support for advanced AR
- Offline caching for models

---

*Document Version: 1.0*  
*Last Updated: 2026-03-11*

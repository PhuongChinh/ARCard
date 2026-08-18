# ARCard - Augmented Reality Card System

A full-stack web application for creating and sharing AR experiences via QR codes.

## Features

- **Admin Panel**: Create, edit, and manage AR cards
- **QR Code Generation**: Auto-generated QR codes for each AR experience
- **3D Model Support**: Upload GLB/GLTF models
- **AR Viewer**: Web-based AR experience using Three.js
- **Analytics**: Track scan counts for each card

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TailwindCSS |
| 3D/AR | Three.js |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL (Supabase) |
| Auth | JWT |
| File Storage | Local / Cloudflare R2 |

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- PostgreSQL database

### 1. Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd ARCard

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

```bash
# Create database
createdb arcard

# Update .env file
cd backend
cp .env.example .env
# Edit .env with your database URL
```

#### Option B: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Get your connection string from Settings → Database
4. Update `DATABASE_URL` in backend/.env

### 3. Environment Variables

Create `.env` files:

**backend/.env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/arcard"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
APP_URL="http://localhost:3000"
PORT=3001
NODE_ENV="development"
```

**frontend/.env:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Or push schema (for quick setup)
npx prisma db push
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
# Runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 6. Create Admin Account

1. Open http://localhost:3000
2. Click "Register"
3. Create your admin account
4. Start creating AR cards!

---

## Usage Guide

### Creating an AR Card

1. Login to admin panel at `/login`
2. Click "New Card"
3. Fill in details:
   - **Title**: Name of your AR experience
   - **Description**: Optional description
   - **3D Model**: Upload a .glb or .gltf file (max 10MB)
   - **MindAR Target**: Compile your marker image with the MindAR compiler and upload the resulting `.mind` file. The printed image is the tracking marker; the `.mind` file contains its tracking data.
   - **Model Scale**: Adjust size (default 1.0)
   - **Zoom Limit**: Max zoom level (default 2.0)
4. Click "Save Card"
5. Go to QR page to download the QR code

For camera AR, open the QR link over HTTPS and grant camera permission. Browser camera access is blocked for normal HTTP URLs opened on a phone.

### Using AR

1. Scan the QR code with a smartphone camera
2. The AR page opens automatically
3. Point camera at the marker image
4. See the 3D model appear!

---

## Deployment

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Vercel        │────▶│   Railway/      │────▶│   Supabase      │
│   (Frontend)    │     │   Render        │     │   (PostgreSQL)  │
│                 │     │   (Backend)     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                              ┌────────┴────────┐
                                              │ Cloudflare R2  │
                                              │ (File Storage) │
                                              └─────────────────┘
```

### Deploy Backend (Railway/Render)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repo
   - Add environment variables:
     ```
     DATABASE_URL=<supabase-connection-string>
     JWT_SECRET=<random-secret>
     APP_URL=<your-frontend-url>
     ```
   - Deploy

3. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repo
   - Select "Web Service"
   - Build command: `npm install`
   - Start command: `npm run start:prod`

### Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Select `frontend` folder
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url>/api
   NEXT_PUBLIC_APP_URL=<your-frontend-url>
   ```
5. Deploy

### Database Setup (Supabase)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add to backend environment variables

### File Storage (Cloudflare R2)

1. Create Cloudflare account
2. Create R2 bucket
3. Get API credentials
4. Update backend `.env`:
   ```env
   USE_S3="true"
   AWS_REGION="auto"
   AWS_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
   AWS_ACCESS_KEY_ID="your-key"
   AWS_SECRET_ACCESS_KEY="your-secret"
   AWS_S3_BUCKET="arcard-uploads"
   CDN_URL="https://your-public-url.r2.dev"
   ```

---

## API Documentation

When backend is running, visit: `http://localhost:3001/api/docs`

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register admin | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/profile` | Get current user | Yes |
| POST | `/api/cards` | Create card | Yes |
| GET | `/api/cards` | List all cards | No |
| GET | `/api/cards/:id` | Get single card | No |
| PUT | `/api/cards/:id` | Update card | Yes |
| DELETE | `/api/cards/:id` | Delete card | Yes |
| POST | `/api/cards/:id/scan` | Increment scan | No |
| POST | `/api/upload/model` | Upload 3D model | Yes |
| POST | `/api/upload/marker` | Upload marker image | Yes |

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Check firewall settings

**File Upload Not Working**
- Check upload folder permissions
- Verify file size limits
- For production, configure S3/R2

**AR Not Loading**
- Ensure HTTPS in production
- Check 3D model format (use GLB)
- Model should be < 5MB

**CORS Errors**
- Update CORS settings in main.ts
- Add your domain to allowed origins

---

## Project Structure

```
ARCard/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── cards/         # Card CRUD
│   │   │   └── upload/        # File uploads
│   │   ├── prisma/            # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/         # Admin panel
│   │   │   ├── ar/            # AR viewer
│   │   │   ├── login/         # Auth pages
│   │   │   └── page.tsx      # Home page
│   │   ├── lib/
│   │   │   └── api.ts         # API client
│   │   └── globals.css
│   └── package.json
│
└── README.md
```

---

## License

MIT

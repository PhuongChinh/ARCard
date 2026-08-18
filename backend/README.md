# ARCard Backend

NestJS REST API for AR Card management system.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Or push schema to database
npm run prisma:push
```

## Configuration

1. Copy `.env.example` to `.env`
2. Update database credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/arcard"
   ```

3. (Optional) Configure S3/R2 for file storage:
   ```env
   USE_S3="true"
   AWS_REGION="auto"
   AWS_ENDPOINT="https://your-r2-account.r2.cloudflarestorage.com"
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_S3_BUCKET="arcard-uploads"
   ```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Once running, visit: `http://localhost:3001/api/docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user (protected)

### Cards
- `POST /api/cards` - Create card (protected)
- `GET /api/cards` - List all cards
- `GET /api/cards/:id` - Get single card
- `PUT /api/cards/:id` - Update card (protected)
- `DELETE /api/cards/:id` - Delete card (protected)
- `POST /api/cards/:id/scan` - Increment scan count

### Upload
- `POST /api/upload/model` - Upload 3D model (protected)
- `POST /api/upload/marker` - Upload marker image (protected)

## Default Admin Account

After first run, register a new admin via `/api/auth/register`.

# iScholar - Scholarship Management System

A comprehensive scholarship application and management platform built with Next.js, Prisma, and MySQL.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (via XAMPP, MAMP, or standalone)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/BinateWizard/ischolar.git
cd ischolar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mysql://root@localhost:3306/ischolar"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional - Get from https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**To generate a NEXTAUTH_SECRET:**
```bash
npx auth secret
```

### 4. Set Up MySQL Database

#### Option A: Using XAMPP (Windows/Mac)
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin at `http://localhost/phpmyadmin`
4. Create a new database named `ischolar`

#### Option B: Using Command Line
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE ischolar;
exit;
```

### 5. Initialize Database Schema

Run Prisma migrations to create all tables:

```bash
npx prisma migrate deploy
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 6. (Optional) Seed Database

If there's seed data available:

```bash
npx prisma db seed
```

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. (Optional) Open Prisma Studio

To view and manage your database:

```bash
npx prisma studio
```

This opens at [http://localhost:5555](http://localhost:5555)

## Common Issues & Troubleshooting

### Database Connection Errors

If you see `Can't reach database server` or `Database does not exist`:

1. **Verify MySQL is running:**
   ```bash
   # Windows (PowerShell)
   netstat -ano | findstr :3306
   
   # Mac/Linux
   netstat -an | grep 3306
   ```

2. **Check database exists:**
   ```bash
   npx prisma db push
   ```

3. **Restart MySQL if needed:**
   - In XAMPP: Stop and Start MySQL
   - Kill hung processes:
     ```bash
     # Windows
     taskkill /F /IM node.exe
     
     # Mac/Linux
     pkill node
     ```

### Prisma Client Generation Errors

If you see file permission errors:

1. Stop all Node processes
2. Delete `.prisma` folder:
   ```bash
   # Windows
   Remove-Item -Recurse -Force node_modules\.prisma
   
   # Mac/Linux
   rm -rf node_modules/.prisma
   ```
3. Regenerate:
   ```bash
   npx prisma generate
   ```

### Database Name Mismatch

Ensure both `.env` and `.env.local` use the same database name (`ischolar`).

## Project Structure

```
ischolar/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── apply/             # Application forms
│   └── profile/           # User profile
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── actions/           # Server actions
│   ├── hooks/             # Custom hooks
│   └── auth.ts            # Auth configuration
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma migrate   # Create new migration
```

## Contributing

### Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

4. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

### Database Schema Changes

If you modify `prisma/schema.prisma`:

1. Create a migration:
   ```bash
   npx prisma migrate dev --name describe_your_change
   ```

2. Commit both the schema and migration files

3. Other collaborators should run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Team Setup Checklist

For new team members:

- [ ] Clone repository
- [ ] Install Node.js and MySQL
- [ ] Run `npm install`
- [ ] Create `.env.local` with database credentials
- [ ] Start MySQL server
- [ ] Run `npx prisma migrate deploy`
- [ ] Run `npx prisma generate`
- [ ] Run `npm run dev`
- [ ] Verify app opens at `http://localhost:3000`

## Documentation

Additional documentation can be found in the `/docs` folder:

- [Application System](./docs/APPLICATION_SYSTEM.md)
- [NextAuth Migration](./docs/NEXTAUTH_MIGRATION.md)
- [Verification System](./VERIFICATION_SYSTEM.md)

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub or contact the maintainers.

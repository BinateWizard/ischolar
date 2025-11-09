# Reset Database - Quick Commands

## Option 1: Prisma Reset (Recommended - Fastest)

This will drop the entire database, recreate it, and run all migrations:

```powershell
npx prisma migrate reset
```

What it does:
- ✅ Drops all tables
- ✅ Recreates the database schema
- ✅ Resets all auto-increment counters to 1
- ✅ Runs all migrations
- ✅ Optionally runs seed scripts (if you have any)

**Note:** This will ask for confirmation. Press `y` to confirm.

## Option 2: Prisma Reset with Skip Seed

If you don't want to run seed data:

```powershell
npx prisma migrate reset --skip-seed
```

## Option 3: Just Clear Data (Keep Schema)

If you want to keep the schema but just delete all records:

```powershell
npx prisma studio
```

Then manually delete records in the browser UI.

## After Database Reset

Don't forget to also clear Firebase Authentication users:
1. Go to [Firebase Console](https://console.firebase.google.com/project/osas-ischolar/authentication/users)
2. Delete all users manually

## Quick Reset Flow

```powershell
# 1. Reset MySQL database (clears everything, resets IDs to 1)
npx prisma migrate reset

# 2. Restart dev server
npm run dev

# 3. Manually delete Firebase users in Console
# 4. Try fresh signup at http://localhost:3000/signup
```

That's it! Much cleaner than SQL scripts. 🚀

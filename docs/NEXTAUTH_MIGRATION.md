# NextAuth Migration Complete

## What Changed

Successfully migrated from Firebase Auth to NextAuth.js with MySQL storage.

## Files Updated

### Authentication Core
- ✅ `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration with Google OAuth and Credentials providers
- ✅ `app/api/auth/signup/route.ts` - User registration API with bcrypt password hashing
- ✅ `types/next-auth.d.ts` - TypeScript definitions for NextAuth

### Pages
- ✅ `app/signup/page.tsx` - Rewritten to use NextAuth (old saved as `page-old.tsx.bak`)
- ✅ `app/signin/page.tsx` - Rewritten to use NextAuth (old saved as `page-old.tsx.bak`)

### Components
- ✅ `components/Navbar.tsx` - Updated to use `useSession()` instead of Firebase
- ✅ `components/AuthProvider.tsx` - SessionProvider wrapper for NextAuth
- ✅ `app/layout.tsx` - Wrapped with AuthProvider

### Database
- ✅ `prisma/schema.prisma` - Added optional `password` field to Profile model
- ✅ Migration applied: `20251110110002_add_password_field`
- ✅ Prisma Client regenerated

## Authentication Flow

### Sign Up (Credentials)
1. User fills form → `/api/auth/signup`
2. Password hashed with bcrypt
3. Profile created in MySQL with `password` field
4. Auto sign-in with NextAuth credentials provider
5. Redirect to `/profile`

### Sign In (Credentials)
1. User enters email/password
2. NextAuth credentials provider verifies with bcrypt
3. JWT token issued with user id and role
4. Session available via `useSession()`

### Sign In (Google OAuth)
1. User clicks Google button
2. OAuth flow via NextAuth GoogleProvider
3. On first sign-in, Profile auto-created in `signIn` callback
4. `verificationStatus` set to `VERIFIED` for OAuth users
5. JWT token issued, redirect to `/profile`

## Environment Variables Needed

Create `.env.local` (see `.env.local.example`):

```env
DATABASE_URL="mysql://root@localhost:3306/ischolar"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
GOOGLE_CLIENT_ID="from Google Cloud Console"
GOOGLE_CLIENT_SECRET="from Google Cloud Console"
```

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

## Session Management

```tsx
import { useSession, signIn, signOut } from "next-auth/react";

function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <button onClick={() => signIn()}>Sign In</button>;
  
  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <p>User ID: {session.user?.id}</p>
      <p>Role: {session.user?.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Server-Side Session

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/signin");
  }
  
  return <div>User ID: {session.user.id}</div>;
}
```

## Next Steps

1. ✅ Copy `.env.local.example` to `.env.local`
2. ✅ Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
3. ⚠️ Add Google OAuth credentials (optional, credentials auth works without it)
4. ⚠️ Test signup flow
5. ⚠️ Test signin flow (both credentials and Google)
6. ⚠️ Remove Firebase dependencies: `npm uninstall firebase`
7. ⚠️ Delete `lib/firebase/` directory

## Firebase Cleanup (TODO)

Files that can be deleted after testing:
- `lib/firebase/auth.ts`
- `lib/firebase/config.ts`
- `app/signup/page-old.tsx.bak`
- `app/signin/page-old.tsx.bak`

## Profile Model Fields

```prisma
model Profile {
  userId               String   @unique  // NextAuth user.id
  email                String   @unique
  password             String?           // null for OAuth users, hashed for credentials
  firstName            String
  lastName             String
  middleInitial        String?
  role                 Role     @default(STUDENT)
  verificationStatus   VerificationStatus @default(PENDING_VERIFICATION)
  // ... other fields
}
```

## Password Handling

- **Credentials signup**: Password hashed with `bcrypt.hash(password, 10)`
- **Credentials signin**: Verified with `bcrypt.compare(password, profile.password)`
- **OAuth signin**: `password` field is `null`, no password needed
- **Auto-verification**: OAuth users get `verificationStatus: VERIFIED` automatically

## Benefits of NextAuth Migration

✅ Unified user database (all users in MySQL, not split with Firebase)  
✅ No external auth provider costs or limits  
✅ Full control over user data and auth flow  
✅ JWT-based sessions (no database session storage needed)  
✅ Easy to add more providers (GitHub, Facebook, etc.)  
✅ Built-in CSRF protection  
✅ Type-safe with TypeScript  
✅ Server-side session access for protected routes

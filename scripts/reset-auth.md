# Reset Authentication - Complete Guide

## Problem
Having auth issues and need to start fresh with clean accounts.

## Solution: Two-Step Reset

### Step 1: Clear Firebase Authentication Users

1. Go to Firebase Console: https://console.firebase.google.com/project/osas-ischolar
2. Navigate to **Authentication** → **Users** tab
3. You'll see all registered users listed
4. For each user:
   - Click the three-dot menu (⋮) on the right
   - Select **Delete account**
   - Confirm deletion
5. Or use bulk delete:
   - Select checkboxes for multiple users
   - Click the trash icon at the top
   - Confirm

### Step 2: Clear MySQL Profiles

**Option A: Using MySQL Workbench (Recommended)**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open the file: `scripts/clear-profiles.sql`
4. Click the lightning bolt icon to execute
5. Check the output - should show 0 remaining profiles

**Option B: Using Command Line**
```powershell
# Navigate to project root
cd C:\Users\aezra\projects\ischolar

# Run the SQL script
mysql -u root -p ischolar < scripts\clear-profiles.sql
```

**Option C: Using Prisma Studio**
```powershell
# Open Prisma Studio
npx prisma studio

# In the browser:
# 1. Click on "Profile" model
# 2. Select all records
# 3. Delete them
# 4. Repeat for other models if needed
```

## Step 3: Verify Firebase Settings

Before creating new accounts, double-check Firebase Console settings:

### Enable Email/Password Authentication
1. Firebase Console → **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. Enable the **first toggle** (Email/Password)
4. Click **Save**

### Allow User Creation
1. Authentication → **Settings** tab
2. Under **User account management**
3. Ensure **"Enable create (sign-up)"** is ON

### Check Authorized Domains
1. Same Settings tab → scroll to **Authorized domains**
2. Ensure `localhost` is listed
3. If running on a different port or IP, add it

## Step 4: Test Fresh Signup

1. Start your dev server:
```powershell
npm run dev
```

2. Go to http://localhost:3000/signup

3. Try these test accounts:

**Test Account 1 (Your real email for verification testing)**
- Last Name: Test
- First Name: User
- Email: your-real-email@outlook.com
- Password: TestPass123!

**Test Account 2 (Different email)**
- Last Name: Admin
- First Name: Test
- Email: another-email@outlook.com
- Password: AdminPass123!

4. Expected flow:
   - ✅ Form submits without errors
   - ✅ Redirects to `/verify-email`
   - ✅ Email arrives in inbox
   - ✅ After clicking verification link, profile created in MySQL
   - ✅ Can sign in successfully

## Common Issues After Reset

### Issue: Still getting "operation-not-allowed"
**Fix**: Clear browser cache and cookies for localhost, then try again

### Issue: Email verification not working
**Fix**: 
- Check spam folder
- In Firebase Console → Authentication → Templates, verify email template is enabled
- Try with a different email provider (Gmail vs Outlook)

### Issue: Profile not created after verification
**Fix**: 
- Ensure MySQL is running: `services.msc` → find MySQL → Status should be "Running"
- Check console for sync-profile errors
- Verify DATABASE_URL in .env is correct

### Issue: Can't delete users in Firebase
**Fix**: You may have lingering sessions. Sign out everywhere:
- Close all browser tabs with your app
- Clear site data in DevTools (F12 → Application → Clear storage)
- Try deletion again

## Quick Reset Command (All-in-One)

If MySQL is running and you have the mysql CLI:
```powershell
# Delete Firebase users (manual in Console - no CLI for this)
# Then run:
mysql -u root -p -e "USE ischolar; DELETE FROM VerificationDocument; DELETE FROM AuditLog; DELETE FROM Notification; DELETE FROM Disbursement; DELETE FROM ScholarshipAward; DELETE FROM Review; DELETE FROM ApplicationFile; DELETE FROM Application; DELETE FROM Profile; SELECT COUNT(*) FROM Profile;"
```

## After Reset Checklist

- [ ] All Firebase users deleted
- [ ] All MySQL profiles cleared
- [ ] Firebase Email/Password provider enabled
- [ ] Firebase user creation allowed
- [ ] localhost in authorized domains
- [ ] Browser cache cleared
- [ ] Dev server restarted
- [ ] Test signup works
- [ ] Email verification arrives
- [ ] Profile created in MySQL after verification
- [ ] Sign in works

---

**Ready to start fresh!** Clear Firebase users first, then MySQL profiles, verify settings, and try signup again. 🎯

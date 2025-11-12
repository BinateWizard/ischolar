# Email Verification Setup Guide

The iScholar platform includes email verification for user signups. This guide explains how to set it up.

## 🎯 Current Status

✅ **Email verification is implemented and ready to use**
- Database schema includes verification tokens
- Verification pages and API routes are created
- Waiting/loading screens are implemented
- Resend verification functionality is available

🔧 **Email sending is currently disabled** (commented out)
- You can enable it by configuring an email provider (see below)
- System works without email - verification links can be copied from database

## 📧 No Domain Required!

You **don't need a custom domain** to send verification emails. You can use:

1. **Gmail SMTP** (free, easy for testing)
2. **SendGrid** (free tier: 100 emails/day)
3. **Resend** (free tier: 3,000 emails/month)
4. **Mailgun**, **Amazon SES**, etc.

## 🚀 Quick Setup Options

### Option 1: Gmail SMTP (Easiest for Testing)

1. **Enable 2-Step Verification** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. **Add to `.env.local`**:
   ```env
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT="587"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-16-char-app-password"
   EMAIL_FROM="iScholar <your-email@gmail.com>"
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up** at [sendgrid.com](https://sendgrid.com) (free tier available)
2. **Create API Key**:
   - Settings → API Keys → Create API Key
   - Choose "Full Access"
   - Copy the key
3. **Add to `.env.local`**:
   ```env
   EMAIL_HOST="smtp.sendgrid.net"
   EMAIL_PORT="587"
   EMAIL_USER="apikey"
   EMAIL_PASS="your-sendgrid-api-key"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

### Option 3: Resend (Modern, Developer-Friendly)

1. **Sign up** at [resend.com](https://resend.com)
2. **Get API Key** from dashboard
3. **Install package**:
   ```bash
   npm install resend
   ```
4. **Add to `.env.local`**:
   ```env
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   ```
5. **Update** `lib/email.ts` to use Resend SDK instead of Nodemailer

## 🔓 Enabling Email Sending

### Step 1: Install Dependencies

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your email credentials.

### Step 3: Uncomment Email Code

In the following files, uncomment the email sending code:

1. **`app/api/auth/signup/route.ts`** (lines ~5, ~67-75)
2. **`app/api/auth/resend-verification/route.ts`** (lines ~5, ~53-62)
3. **`lib/email.ts`** (already ready to use)

### Step 4: Test

1. Start your dev server: `npm run dev`
2. Sign up with a real email address
3. Check your inbox for the verification email
4. Click the verification link

## 🧪 Testing Without Email

The system works even without email configured:

1. User signs up
2. Verification token is saved in database
3. You can manually get the token from database:
   ```sql
   SELECT verificationToken FROM profiles WHERE email = 'user@example.com';
   ```
4. Navigate to: `http://localhost:3000/verify-email?token=THE_TOKEN`

## 📁 File Structure

```
lib/
  └── email.ts                          # Email sending utility

app/
  ├── api/auth/
  │   ├── signup/route.ts               # Creates user + token, sends email
  │   ├── verify-email/route.ts         # Verifies token from email link
  │   └── resend-verification/route.ts  # Resends verification email
  ├── verify-email/
  │   └── page.tsx                      # Verification confirmation page
  └── pending-verification/
      └── page.tsx                      # Waiting screen after signup

prisma/schema.prisma                    # Database schema with tokens
```

## 🔐 Security Features

- ✅ Tokens are cryptographically random (32 bytes)
- ✅ Tokens expire after 24 hours
- ✅ Tokens are deleted after successful verification
- ✅ Email enumeration protection (resend endpoint)
- ✅ One-time use tokens

## 🎨 User Flow

1. **Sign Up** → User fills form
2. **Account Created** → Token generated & saved
3. **Email Sent** → Verification link delivered
4. **Waiting Screen** → User sees "Check your email" page
5. **Click Link** → Opens verification page
6. **Email Verified** → Token validated, account activated
7. **Sign In** → User can now access the platform

## ❓ FAQ

**Q: Do I need to configure email right now?**
A: No! The system works without it. You can add email later when ready.

**Q: Will users be able to sign in without verifying?**
A: Currently yes, but you can add checks in your auth logic if needed.

**Q: Can I use localhost for development?**
A: Yes! Gmail, SendGrid, and Resend all work with localhost.

**Q: What if the verification link expires?**
A: Users can click "Resend Verification Email" on the waiting screen.

**Q: Can I customize the email template?**
A: Yes! Edit the HTML in `lib/email.ts`.

## 🚨 Troubleshooting

**Email not sending:**
1. Check environment variables are set correctly
2. Verify email credentials are valid
3. Check console for error messages
4. Try Gmail app password first (easiest to test)

**"Can't find module 'nodemailer'":**
```bash
npm install nodemailer @types/nodemailer
```

**Gmail "Less secure app access":**
- Don't use regular password
- Use App Passwords (requires 2FA enabled)

## 📝 Next Steps

Once email is configured and tested:

1. ✅ Test signup flow end-to-end
2. ✅ Test resend verification
3. ✅ Test expired tokens
4. ✅ Customize email templates
5. ✅ Add verification checks to protected routes
6. ✅ Add email verification status to admin dashboard

---

**Need help?** Check the code comments or open an issue on GitHub.

# Notification System Documentation

## Overview
Comprehensive notification system for iScholar with smart alerts, real-time updates, and admin dashboard integration.

## Features Implemented

### 1. Database Schema ✅
- **NotificationType Enum**: 10 types including APPLICATION_SUBMITTED, APPROVED, DENIED, VERIFICATION statuses, THRESHOLD_WARNING, etc.
- **Notification Model**: Enhanced with actionUrl, relatedId, priority levels (LOW, NORMAL, HIGH, URGENT)
- **Migration**: `20251112161620_add_notification_enhancements`

### 2. API Endpoints ✅

#### `/api/notifications` (GET)
- Fetch user notifications with pagination
- Query params: `limit` (default: 20), `unread` (boolean)
- Returns notifications ordered by unread first, then newest

#### `/api/notifications/mark-read` (POST)
- Mark single notification as read: `{ notificationId: "uuid" }`
- Mark all as read: `{}` (empty body)

#### `/api/notifications/count` (GET)
- Get unread notification count for current user
- Used for notification bell badge

#### `/api/admin/check-thresholds` (POST)
- Admin-only endpoint to manually trigger threshold checks
- Returns count of alerts created

### 3. Notification Bell Component ✅
**Location**: `components/NotificationBell.tsx`

**Features**:
- SVG bell icon (no external images needed)
- Real-time unread count badge (red circle with number)
- Auto-refresh every 30 seconds
- Dropdown with recent notifications
- Click notification to navigate to actionUrl
- Mark individual or all as read
- Priority-based color coding
- Relative timestamps (e.g., "2h ago", "Just now")

**Integrated** in `components/Navbar.tsx`

### 4. Notification Utility Functions ✅
**Location**: `lib/notifications.ts`

**Functions**:
- `createNotification()` - Create notification for specific user
- `notifyAdmins()` - Notify all ADMIN, REVIEWER, APPROVER roles
- `notifyUser()` - Wrapper for single user notification
- `markAsRead()` - Mark single notification as read
- `markAllAsRead()` - Mark all user notifications as read
- `getUnreadCount()` - Get count of unread notifications
- `checkThresholds()` - Smart threshold checking for programs
- `notifyNewApplication()` - Trigger when application submitted
- `notifyApplicationStatus()` - Notify status changes (APPROVED/DENIED/etc)
- `notifyVerificationStatus()` - Document verification results

### 5. Smart Threshold Alerts ✅

**Slot Capacity Monitoring**:
- ⚠️ **80% capacity**: Warning alert (HIGH priority)
- 🔴 **100% capacity**: Urgent alert (URGENT priority)

**How it works**:
1. Checks all ProgramCycles with maxSlots
2. Counts APPROVED applications
3. Calculates percentage filled
4. Creates notifications for admins at 80% and 100%

### 6. Admin Dashboard Integration ✅
**Location**: `app/admin/page.tsx`

**New Sections**:
- **Important Alerts**: Shows URGENT/HIGH priority notifications at top
- **Pending Actions Card**: Yellow card highlighting pending applications & verifications
- **Quick Links**: Direct links to view details and take action

**Visual Indicators**:
- Red alerts for URGENT items
- Orange alerts for HIGH priority
- Yellow card for pending actions
- Badges with counts

### 7. Access Control
- **Notification APIs**: Any authenticated user can access their own notifications
- **Threshold Check**: Admin-only (can be scheduled via cron)
- **Admin Dashboard**: ADMIN, REVIEWER, APPROVER roles

## Usage Examples

### Creating a Notification
```typescript
import { notifyUser, notifyAdmins } from '@/lib/notifications';

// Notify specific user
await notifyUser(userId, {
  title: '🎉 Application Approved!',
  body: 'Your scholarship application has been approved.',
  type: 'APPLICATION_APPROVED',
  actionUrl: '/status',
  priority: 'HIGH',
});

// Notify all admins
await notifyAdmins({
  title: '📝 New Application Submitted',
  body: 'John Doe has submitted a TES application.',
  type: 'APPLICATION_SUBMITTED',
  actionUrl: `/admin/applications/${appId}`,
  relatedId: appId,
  priority: 'NORMAL',
});
```

### Checking Thresholds (Manual)
```typescript
// In admin panel or API route
const alerts = await checkThresholds();
console.log(`Created ${alerts.length} threshold alerts`);
```

### Frontend - Fetching Notifications
```typescript
// Get recent notifications
const res = await fetch('/api/notifications?limit=10');
const notifications = await res.json();

// Get unread count
const countRes = await fetch('/api/notifications/count');
const { count } = await countRes.json();
```

## Next Steps (To Implement)

### 1. File Upload System
- Add file upload to application forms
- Store in ApplicationFile table
- Support PDF, images, documents
- File size validation and preview

### 2. Admin Verification Page
- Review uploaded documents
- Approve/reject with reasons
- View file previews
- Bulk actions

### 3. Notification Triggers
Add automatic notifications to:
- `app/api/applications/submit/route.ts` → call `notifyNewApplication()`
- `app/api/applications/update-status/route.ts` → call `notifyApplicationStatus()`
- `app/api/verifications/review/route.ts` → call `notifyVerificationStatus()`

### 4. Scheduled Threshold Checks
Set up cron job or scheduled task to call `/api/admin/check-thresholds` daily

Example (using Vercel Cron):
```json
// vercel.json
{
  "crons": [{
    "path": "/api/admin/check-thresholds",
    "schedule": "0 9 * * *"
  }]
}
```

### 5. Email Notifications (Optional)
Integrate with existing Resend setup to send email when:
- High priority notifications created
- Application status changes
- Verification required

## Testing Checklist

- [ ] Create test notifications with different priorities
- [ ] Verify unread count updates in real-time
- [ ] Test mark as read (single and all)
- [ ] Test notification bell dropdown
- [ ] Test clicking notifications navigates correctly
- [ ] Create program cycles and test threshold alerts
- [ ] Verify admin dashboard shows alerts
- [ ] Test role-based access (STUDENT vs ADMIN)
- [ ] Test notification polling (30 second refresh)
- [ ] Test mobile responsiveness of notification bell

## Database Queries

### Get all unread notifications for user
```sql
SELECT * FROM notifications 
WHERE user_id = ? AND is_read = false 
ORDER BY created_at DESC;
```

### Count pending verifications
```sql
SELECT COUNT(*) FROM profiles 
WHERE verification_status = 'PENDING_VERIFICATION';
```

### Find near-capacity programs
```sql
SELECT pc.*, p.name, COUNT(a.id) as approved_count
FROM program_cycles pc
JOIN programs p ON pc.program_id = p.id
LEFT JOIN applications a ON a.program_cycle_id = pc.id AND a.status = 'APPROVED'
WHERE pc.max_slots IS NOT NULL
GROUP BY pc.id
HAVING (COUNT(a.id) * 100.0 / pc.max_slots) >= 80;
```

## Icons Used (SVG)

All icons are inline SVG - no external dependencies:
- 🔔 Bell icon (notification bell)
- ⚠️ Alert icon (warnings)
- ✅ Check icon (success)
- 📝 Document icon (applications)
- 👥 Users icon (user management)
- ⏰ Clock icon (pending actions)

## Security Considerations

- ✅ User can only see their own notifications
- ✅ Mark as read requires notification ownership check
- ✅ Admin-only threshold checking
- ✅ No sensitive data in notification bodies
- ✅ Action URLs validated before navigation

## Performance

- Notifications indexed on `[userId, isRead]` for fast queries
- Polling limited to 30 second intervals
- Dropdown fetches only last 10 notifications
- Count API optimized with simple COUNT query
- Threshold checks can be scheduled (not real-time)

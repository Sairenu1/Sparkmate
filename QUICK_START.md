# SparkMate - Quick Start Guide

## 🚀 Quick Commands

### Start Backend
```bash
cd sparkmate-backend
mvn spring-boot:run
```
→ Runs on http://localhost:8080

### Start Frontend
```bash
cd sparkmate-frontend
npm install
npm run dev
```
→ Runs on http://localhost:5173

---

## 📱 Application Output Overview

### 🎨 Visual Design
Your application features a **modern dark theme** with:
- Deep black backgrounds (#000000)
- Vibrant pink/magenta accents (#ff006e)
- Purple gradients (#8338ec)
- Glassmorphism effects (frosted glass)
- Smooth animations throughout
- Responsive mobile-first design

### 📄 Main Screens

#### 1. **Login Page** 
```
┌─────────────────────────────┐
│   💕 SparkMate              │
│                             │
│   [Email Input]             │
│   [Password Input]          │
│                             │
│   [Sign In Button]          │
│                             │
│   Don't have account?       │
│   Create one                │
└─────────────────────────────┘
```

#### 2. **Discover Page** (Main Swiping)
```
┌─────────────────────────────┐
│  Discover          [Filter] │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │   [Profile Photo]   │   │
│  │                     │   │
│  │   Emma, 24 ✓        │   │
│  │   📍 New York, 2mi  │   │
│  │                     │   │
│  │   Adventure seeker  │   │
│  │   Coffee lover ☕   │   │
│  │                     │   │
│  │   [Travel] [Yoga]   │   │
│  └─────────────────────┘   │
│                             │
│  [X]  [⭐]  [❤️]            │
└─────────────────────────────┘
```

#### 3. **Matches Page**
```
┌─────────────────────────────┐
│  Your Matches               │
│                             │
│  ┌─────┐                    │
│  │ 👤 │ Emma               │
│  └─────┘ Hey! How's your   │
│       2m ago  [2]          │
│                             │
│  ┌─────┐                    │
│  │ 👤 │ Sophia             │
│  └─────┘ That sounds...    │
│       1h ago               │
│                             │
│  ┌─────┐                    │
│  │ 👤 │ Olivia             │
│  └─────┘ Can't wait...     │
│       3h ago  [1]          │
└─────────────────────────────┘
```

#### 4. **Chat Page**
```
┌─────────────────────────────┐
│  ← Sarah Johnson    ●       │
├─────────────────────────────┤
│                             │
│        Hey! How are you?    │
│        10:30 AM             │
│                             │
│  I'm great! How about you?  │
│        10:32 AM             │
│                             │
│        Doing well, thanks!😊│
│        10:33 AM             │
│                             │
├─────────────────────────────┤
│  [Type a message...]   [→]  │
└─────────────────────────────┘
```

#### 5. **Profile Page**
```
┌─────────────────────────────┐
│       [Profile Photo]       │
│        John Doe 👑          │
│   Digital creator...        │
│                             │
│  [24]  [156]  [89]          │
│  Matches Views Likes        │
│                             │
│  [✏️]  Edit Profile         │
│  [👑]  Go Premium           │
│  [⚙️]  Settings             │
│  [❓]  Help & Support        │
│  [🛡️]  Safety Center        │
│  [🚪]  Logout               │
└─────────────────────────────┘
```

#### 6. **Admin Dashboard**
```
┌─────────────────────────────────────┐
│  Admin Dashboard                    │
│  [Search Users...]  [⚙️]            │
├─────────────────────────────────────┤
│  [12,543] [8,234] [45,678] [23]    │
│  Users   Matches  Messages Reports │
├─────────────────────────────────────┤
│  [Overview] [Users] [Reports] [Analytics] │
├─────────────────────────────────────┤
│                                     │
│  User Management Table:             │
│  ┌──────────────────────────────┐  │
│  │ Avatar │ Name │ Role │ Status│  │
│  ├──────────────────────────────┤  │
│  │   J    │ John │ USER │ Active│  │
│  │   J    │ Jane │ USER │ Active│  │
│  │   B    │ Bob  │ USER │Banned │  │
│  └──────────────────────────────┘  │
│                                     │
│  Action Buttons: [👁️] [🚫]          │
└─────────────────────────────────────┘
```

---

## 🎯 Key Features Output

### ✅ Working Features
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Profile viewing and editing
- ✅ Card-based swiping interface
- ✅ Match creation
- ✅ Chat/messaging interface
- ✅ Admin dashboard with:
  - User statistics
  - User management (ban/unban)
  - Report moderation
  - Analytics overview
- ✅ Dark theme throughout
- ✅ Responsive design
- ✅ Smooth animations

### 🔐 Security Output
- ✅ Protected routes (PrivateRoute)
- ✅ Admin-only routes (AdminRoute)
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Password hashing (BCrypt)
- ✅ CORS configuration

### 📊 Data Output
- ✅ User accounts stored in PostgreSQL
- ✅ Profiles linked to users
- ✅ Matches tracked in database
- ✅ Messages stored per match
- ✅ Reports for moderation
- ✅ Analytics aggregated

---

## 🎨 Color Palette Output

```
Primary Colors:
- Background: #000000 (Black)
- Primary: #ff006e (Pink)
- Secondary: #8338ec (Purple)
- Accent: #3a86ff (Blue)
- Success: #4ade80 (Green)
- Warning: #ff6b35 (Orange)

Gradients:
- Pink to Purple: (#ff006e → #ff4458 → #8338ec)
- Glass Effect: rgba(255,255,255,0.05) with blur
```

---

## 📦 What You Get

### Frontend Package
- 20+ React components
- 5+ CSS style files
- API service layer
- Context providers
- Protected routes
- Complete navigation system

### Backend Package
- RESTful API endpoints
- JWT authentication
- Spring Security configuration
- Database repositories
- Service layer
- Admin functionality
- Error handling

---

## 🔄 User Journey Output

1. **New User**
   ```
   Signup → Login → Discover → Swipe → Match → Chat
   ```

2. **Existing User**
   ```
   Login → Discover/Matches/Profile → Chat with matches
   ```

3. **Admin User**
   ```
   Login → Admin Dashboard → Manage Users → Moderate Reports
   ```

---

## 📈 Statistics Output

When running, your application will show:
- Total registered users
- Total matches created
- Total messages sent
- Pending reports count
- User growth metrics
- Engagement statistics

---

## 🎯 Expected Behavior

### On Login
- ✅ Token stored in localStorage
- ✅ User data cached
- ✅ Redirect to /discover
- ✅ Navigation bar appears
- ✅ Bottom nav bar appears

### On Discover
- ✅ Profile cards animate in
- ✅ Swipe actions work
- ✅ Toast notifications show
- ✅ Cards cycle through stack

### On Admin Access
- ✅ Dashboard loads statistics
- ✅ User table populates
- ✅ Reports list shows
- ✅ Actions (ban/resolve) work

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Solution**: Check PostgreSQL is running and database exists

### Issue: Frontend can't connect to backend
**Solution**: Verify API URL in `.env` or check CORS settings

### Issue: Admin dashboard not accessible
**Solution**: Ensure user role is 'ADMIN' in database

### Issue: Login redirects immediately
**Solution**: Check localStorage has valid token

---

## 📞 Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] User can view profiles
- [ ] User can swipe (like/pass)
- [ ] Matches appear in matches page
- [ ] Chat functionality works
- [ ] Admin can access dashboard
- [ ] Admin can ban/unban users
- [ ] Admin can resolve reports
- [ ] All pages load correctly
- [ ] Dark theme applies everywhere
- [ ] Animations work smoothly

---

## 🎉 Success Indicators

Your application is working correctly if:
- ✅ Login page shows with gradient background
- ✅ After login, discover page shows profile cards
- ✅ Bottom navigation works
- ✅ Chat interface loads
- ✅ Admin dashboard shows statistics
- ✅ All buttons have hover effects
- ✅ Toast notifications appear on actions
- ✅ No console errors

---

**Your SparkMate dating app is ready to run! 🚀💕**


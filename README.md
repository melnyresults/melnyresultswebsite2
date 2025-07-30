# Melny Results Blog

A modern, high-performance blog platform with advanced engagement features including comments, likes, and admin management.

## 🚀 Quick Start

This application consists of two parts that need to run simultaneously:
1. **Frontend** (React + Vite) - The blog website
2. **Backend** (Node.js + Express) - API server for comments and likes

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup Instructions

#### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
# Edit .env file with your configuration if needed
```

#### 3. Initialize Database

```bash
cd backend
npm run init-db
cd ..
```

#### 4. Start Both Servers

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

**Terminal 2 - Start Frontend Server:**
```bash
npm run dev
```
The frontend will run on `https://localhost:5173`

### 🔧 Development Workflow

1. **Always start the backend first** - The frontend depends on the backend API
2. **Keep both servers running** - Comments and likes won't work without the backend
3. **Check backend logs** - If you see API errors, check the backend terminal for issues

### 📁 Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities and configurations
├── backend/               # Backend API server
│   ├── routes/            # API route handlers
│   ├── database/          # Database initialization
│   └── scripts/           # Database setup scripts
└── public/                # Static assets
```

### 🛠️ Available Scripts

#### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend Scripts
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run init-db` - Initialize database and create admin user

### 🔐 Admin Access

After running `npm run init-db`, you can access the admin panel at:
- URL: `https://localhost:5173/admin`
- Username: `admin` (or from your .env file)
- Password: Check your backend `.env` file or console output

### 🐛 Troubleshooting

#### "Failed to fetch" or "ECONNREFUSED" errors:
- Ensure the backend server is running on port 3001
- Check that both servers are started in the correct order
- Verify the backend `.env` file includes `http://localhost:5173` in CORS_ORIGINS

#### Comments/Likes not working:
- Confirm both frontend and backend servers are running
- Check browser console and backend terminal for error messages
- Ensure database was initialized with `npm run init-db`

#### Database issues:
- Delete `backend/database/blog.db` and run `npm run init-db` again
- Check file permissions in the backend/database directory

### 📊 Features

- **Modern Blog Interface** - Clean, responsive design
- **Comment System** - User comments with admin moderation
- **Like System** - Post likes with duplicate prevention
- **Admin Dashboard** - Manage comments and view analytics
- **SEO Optimized** - Meta tags, sitemap, robots.txt
- **Performance** - Optimized loading and caching

### 🚀 Deployment

For production deployment, see the detailed instructions in `backend/README.md`.

### 📝 License

MIT License - see LICENSE file for details.
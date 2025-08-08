# Melny Results Blog

A modern, high-performance blog platform built with React, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and authentication)

### Setup Instructions

#### 1. Clone and Install Dependencies

```bash
npm install
```

#### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Click the "Connect to Supabase" button in the top right of the application
3. Follow the setup wizard to configure your database

#### 3. Start Development Server

```bash
npm run dev
```

The application will run on `https://localhost:5173`

### 📁 Project Structure

```
├── src/
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   └── pages/             # Page components
├── supabase/              # Database migrations
└── public/                # Static assets
```

### 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### 🔐 Admin Access

After setting up Supabase, you can access the admin panel at:
- URL: `https://localhost:5173/admin/login`
- Use your Supabase authentication credentials

### 📊 Features

- **Modern Blog Interface** - Clean, responsive design
- **Comment System** - User comments with admin moderation
- **Like System** - Post likes with duplicate prevention
- **Admin Dashboard** - Manage comments and view analytics
- **SEO Optimized** - Meta tags, sitemap, robots.txt
- **Performance** - Optimized loading and caching
- **Supabase Integration** - Real-time database and authentication

### 🚀 Deployment

The application is ready for deployment to Netlify, Vercel, or any static hosting provider.

### 📝 License

MIT License - see LICENSE file for details.
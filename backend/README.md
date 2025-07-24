# Melny Results Blog Engagement API

A custom, secure blog engagement system with comments and likes functionality.

## Features

- 💬 **Comment System**: Users can post comments on blog posts
- ❤️ **Like System**: Users can like blog posts (IP-based duplicate prevention)
- 🔐 **Admin Panel**: Approve/delete comments, view analytics
- 🛡️ **Security**: Rate limiting, input validation, CORS protection
- 📊 **Analytics**: Comment and like statistics

## Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Initialize Database

```bash
npm run init-db
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Comments

- `GET /api/comments/:slug` - Get approved comments for a blog post
- `POST /api/comments/:slug` - Submit a new comment (pending approval)

### Likes

- `GET /api/likes/:slug` - Get like count for a blog post
- `POST /api/likes/:slug/like` - Like a blog post

### Admin

- `POST /api/admin/login` - Admin login
- `GET /api/admin/comments` - Get all comments (requires auth)
- `PUT /api/admin/comments/:id/approve` - Approve comment (requires auth)
- `DELETE /api/admin/comments/:id` - Delete comment (requires auth)
- `GET /api/admin/stats` - Get analytics (requires auth)

## Database Schema

### Comments Table
- `id` - Primary key
- `post_slug` - Blog post identifier
- `author_name` - Comment author name
- `author_email` - Comment author email
- `content` - Comment text
- `ip_address` - User IP (for moderation)
- `status` - 'pending' or 'approved'
- `created_at` - Timestamp

### Likes Table
- `id` - Primary key
- `post_slug` - Blog post identifier
- `ip_address` - User IP (prevents duplicates)
- `created_at` - Timestamp

### Like Counts Table
- `post_slug` - Blog post identifier (primary key)
- `count` - Total likes for the post
- `updated_at` - Last update timestamp

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs sanitized and validated
- **CORS Protection**: Configurable allowed origins
- **JWT Authentication**: Secure admin authentication
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input escaping and sanitization

## Deployment

### VPS Deployment

1. **Upload files to your VPS**
2. **Install dependencies**: `npm install`
3. **Configure environment**: Edit `.env` file
4. **Initialize database**: `npm run init-db`
5. **Start with PM2** (recommended):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "blog-api"
   pm2 startup
   pm2 save
   ```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.melnyresults.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DB_PATH` | SQLite database path | ./database/blog.db |
| `JWT_SECRET` | JWT signing secret | (required) |
| `ADMIN_USERNAME` | Admin username | admin |
| `ADMIN_PASSWORD` | Admin password | (required) |
| `CORS_ORIGINS` | Allowed CORS origins | localhost:5173 |

## Monitoring

- Health check: `GET /health`
- View logs: `pm2 logs blog-api`
- Monitor performance: `pm2 monit`

## Support

For issues or questions, check the logs and ensure all environment variables are properly configured.
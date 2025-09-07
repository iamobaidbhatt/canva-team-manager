# Vercel Deployment Guide

This guide will help you deploy your Canva Pro Team Manager application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Version 16 or higher

## Project Structure

Your project has been configured for Vercel deployment with the following structure:

```
├── client/                 # React frontend
├── server/
│   └── api/               # Vercel serverless functions
│       ├── auth/
│       ├── teams/
│       ├── admin/
│       ├── database/
│       └── utils/
├── vercel.json            # Vercel configuration
└── env.example            # Environment variables template
```

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. **Commit all changes** to your local repository:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **No**
   - Project name: `canva-team-manager` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? **No**

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/build`

### 3. Configure Environment Variables

1. In your Vercel dashboard, go to your project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `JWT_SECRET` | `your-super-secret-jwt-key-change-this` | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |

   **Important**: Generate a strong JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### 4. Redeploy

After adding environment variables, redeploy your project:
```bash
vercel --prod
```

## API Endpoints

Your deployed application will have the following API endpoints:

- `GET /api/teams` - Get available teams
- `POST /api/teams/[teamId]/join` - Join a team
- `POST /api/auth/login` - Admin login
- `GET /api/admin/teams` - Get all teams (admin)
- `POST /api/admin/teams` - Create team (admin)
- `PUT /api/admin/teams/[id]` - Update team (admin)
- `DELETE /api/admin/teams/[id]` - Delete team (admin)
- `GET /api/admin/stats` - Get statistics (admin)
- `GET /api/admin/recent-joins` - Get recent joins (admin)
- `PUT /api/admin/settings` - Update admin settings (admin)
- `GET /api/health` - Health check

## Default Admin Credentials

After deployment, you can log in with:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change these credentials immediately after first login!

## Database Considerations

### Current Setup (In-Memory SQLite)
- Data is stored in memory and resets on each function invocation
- Suitable for demonstration and testing
- **Not suitable for production** with real users

### Production Database Options

For a production deployment, consider migrating to:

1. **PostgreSQL** (Recommended)
   - Use Vercel Postgres or external service like Supabase
   - Update database connection in `server/api/database/init.js`

2. **MongoDB**
   - Use MongoDB Atlas
   - Update to use MongoDB driver

3. **PlanetScale** (MySQL)
   - Serverless MySQL database
   - Good for Vercel integration

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable SSL (automatic with Vercel)

## Monitoring and Analytics

Vercel provides built-in analytics:
- **Vercel Analytics**: Automatic performance monitoring
- **Function Logs**: View serverless function logs
- **Real User Monitoring**: Track user interactions

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Review build logs in Vercel dashboard

2. **API Errors**
   - Check function logs in Vercel dashboard
   - Verify environment variables are set
   - Test API endpoints individually

3. **Database Issues**
   - Remember: In-memory database resets on each function call
   - Consider migrating to persistent database for production

### Debug Commands

```bash
# Test locally with Vercel
vercel dev

# View deployment logs
vercel logs

# Check function status
vercel inspect
```

## Security Considerations

1. **Change Default Credentials**: Update admin username/password
2. **Strong JWT Secret**: Use a cryptographically secure secret
3. **Environment Variables**: Never commit secrets to repository
4. **Rate Limiting**: Consider implementing Redis-based rate limiting
5. **HTTPS**: Vercel provides automatic HTTPS

## Performance Optimization

1. **Image Optimization**: Use Vercel's built-in image optimization
2. **Edge Functions**: Consider moving some logic to Edge Runtime
3. **Caching**: Implement appropriate caching strategies
4. **Database Connection Pooling**: For persistent databases

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Project Issues**: Create issues in your repository

## Next Steps

1. **Test the deployment** thoroughly
2. **Set up monitoring** and alerts
3. **Plan database migration** for production use
4. **Implement backup strategies**
5. **Set up CI/CD** for automated deployments

Your Canva Pro Team Manager is now ready for production deployment on Vercel! 🚀

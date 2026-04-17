# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env` on production server
- [ ] Update `MONGOURL` with production MongoDB Atlas connection string
- [ ] Generate strong `JWT_SECRET` (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Generate strong `SECRET` for password encryption
- [ ] Update `FRONTEND_URL` with your production frontend domain
- [ ] Configure `AUTH_EMAIL` and `AUTH_PASSWORD` for email service

### 2. MongoDB Atlas Setup
- [ ] Whitelist production server IP in MongoDB Atlas Network Access
- [ ] Or use `0.0.0.0/0` for any IP (less secure but works everywhere)
- [ ] Ensure database user has proper permissions
- [ ] Test connection string locally first

### 3. Security Dependencies
Run this command to install security packages:
```bash
npm install helmet express-rate-limit express-mongo-sanitize
```

### 4. File Uploads & Storage
- [ ] Ensure `uploads/` and `invoices/` directories exist
- [ ] Set proper permissions (755 for directories)
- [ ] Consider using cloud storage (AWS S3, Cloudinary) for production
- [ ] Add file size limits and validation

### 5. Email Configuration
- [ ] Use Gmail App Password (not regular password)
- [ ] Enable 2FA on Gmail account
- [ ] Generate App-Specific Password from Google Account settings
- [ ] Test email sending before deployment

## Deployment Steps

### Option 1: Deploy to Render/Railway/Heroku

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables in platform dashboard
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Option 2: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

1. SSH into server
2. Install Node.js (v18+ recommended)
3. Clone repository
4. Install dependencies: `npm install --production`
5. Create `.env` file with production values
6. Install PM2: `npm install -g pm2`
7. Start app: `pm2 start server.js --name hotel-backend`
8. Setup PM2 startup: `pm2 startup` and `pm2 save`
9. Configure Nginx as reverse proxy (optional)

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:6013;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment

### 1. Test Endpoints
- [ ] Health check: `GET /health`
- [ ] User registration: `POST /register`
- [ ] User login: `POST /login`
- [ ] Test file uploads
- [ ] Test booking creation and email sending

### 2. Monitoring
- [ ] Setup error logging (consider Sentry, LogRocket)
- [ ] Monitor server resources (CPU, RAM, Disk)
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor MongoDB Atlas metrics

### 3. Backup Strategy
- [ ] Enable MongoDB Atlas automated backups
- [ ] Backup uploaded files regularly
- [ ] Document restore procedures

## Important Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use strong secrets** - Generate random strings for JWT_SECRET and SECRET
3. **Whitelist specific IPs** - Don't use 0.0.0.0/0 in MongoDB Atlas for production
4. **Enable HTTPS** - Use Let's Encrypt SSL certificate
5. **Rate limiting** - Already configured in server.js
6. **Keep dependencies updated** - Run `npm audit` regularly

## Troubleshooting

### MongoDB Connection Issues
- Verify IP whitelist in Atlas
- Check connection string format
- Ensure network connectivity
- Check MongoDB Atlas cluster status

### Email Not Sending
- Verify Gmail App Password
- Check AUTH_EMAIL and AUTH_PASSWORD in .env
- Test with a simple email first
- Check Gmail security settings

### File Upload Issues
- Verify directory permissions
- Check disk space
- Ensure multer configuration is correct
- Check file size limits

## Performance Optimization

1. Enable compression (already added)
2. Use CDN for static files
3. Implement caching strategies
4. Optimize database queries
5. Consider Redis for session management
6. Use PM2 cluster mode for multiple instances

## Scaling Considerations

- Use load balancer for multiple instances
- Migrate file uploads to cloud storage (S3, Cloudinary)
- Consider MongoDB sharding for large datasets
- Implement Redis for caching
- Use message queues for email sending (Bull, RabbitMQ)

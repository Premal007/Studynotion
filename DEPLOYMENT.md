# Deployment Guide

## Post-Deployment Checklist

### 1. Initial Testing
- [ ] Frontend loads at `https://your-domain.vercel.app`
- [ ] Backend health check at `https://your-domain.vercel.app/api/health`
- [ ] API endpoints respond correctly

### 2. Update Configuration
- [ ] Update CORS with actual domain in `server2/index.js`
- [ ] Update environment variables in Vercel dashboard
- [ ] Redeploy after configuration changes

### 3. Core Functionality Tests
- [ ] User registration and login
- [ ] Course creation and management
- [ ] File uploads (images, videos)
- [ ] Payment integration
- [ ] Email notifications

### 4. Environment Variables Required
```
# Backend
NODE_ENV=production
MONGODB_URL=your_mongodb_connection
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
MAIL_HOST=your_email_host
MAIL_USER=your_email_user
MAIL_PASS=your_email_password

# Frontend
VITE_API_URL=https://your-domain.vercel.app/api/v1
```

### 5. Troubleshooting
- Check Vercel function logs for errors
- Verify database connectivity
- Test API endpoints with Postman
- Check browser console for CORS errors

### 6. Performance Monitoring
- Monitor API response times
- Check file upload functionality
- Verify email delivery
- Test payment processing

## Support
For issues, check:
1. Vercel deployment logs
2. Browser developer console
3. Network tab for API calls
4. Database connection status 
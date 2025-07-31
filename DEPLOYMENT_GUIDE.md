# JavaScript Playground Deployment Guide

## Overview
This Next.js application is configured for static export deployment and requires specific deployment steps.

## Configuration
- **Build Mode**: Static Export (`output: "export"` in next.config.ts)
- **Deployment**: Serves pre-built static files from `/out` directory
- **Port**: 3000 (configurable)

## Common Issues and Solutions

### 1. Runtime Error: "Cannot find module './447.js'"

**Symptoms:**
- Error occurs during server-side rendering or page load
- Missing webpack chunk files
- Build artifacts inconsistency

**Root Cause:**
- Stale build artifacts in `.next` directory
- Webpack runtime trying to load outdated chunk references
- Inconsistent build state

**Solution:**
```bash
# Clean and rebuild
rm -rf .next
npm run build

# Serve static export (NOT npm start)
npm run serve
# OR
npx serve@latest out -p 3000
```

### 2. "next start" Error with Export Configuration

**Error Message:**
```
"next start" does not work with "output: export" configuration.
Use "npx serve@latest out" instead.
```

**Solution:**
Use the proper serving command for static exports:
```bash
npm run serve
```

## Deployment Steps

1. **Development:**
   ```bash
   npm run dev
   ```

2. **Build for Production:**
   ```bash
   npm run build
   ```

3. **Serve Production Build:**
   ```bash
   npm run serve
   # OR
   npm start
   ```

## Troubleshooting

### Missing Chunks/Modules
1. Delete `.next` directory: `rm -rf .next`
2. Rebuild: `npm run build`
3. Serve: `npm run serve`

### Port Already in Use
1. Kill existing processes: `pkill -f "next\|serve"`
2. Start fresh: `npm run serve`

### Build Errors
1. Clear cache: `rm -rf .next node_modules package-lock.json`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

## Production Deployment

For production environments, use a proper static file server:
- **Nginx**: Configure to serve `/out` directory
- **Apache**: Set DocumentRoot to `/out`
- **CDN**: Upload `/out` contents to CDN
- **Vercel/Netlify**: Configure for static site deployment

## Environment Variables

No additional environment variables required for basic deployment.
For custom configurations, create `.env.local` file.

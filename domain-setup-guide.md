# Custom Domain Setup for College Reclaim

## Option 1: Free Custom Domain Options
- **Vercel Subdomain**: college-reclaim.vercel.app (if available)
- **Free Domain Services**: 
  - Freenom (.tk, .ml, .ga domains)
  - GitHub Pages custom domain
  - Netlify subdomain

## Option 2: Purchase Custom Domain
- **Recommended domains**:
  - college-reclaim.com
  - college-reclaim.org
  - college-reclaim.edu (if eligible)

## Setup Instructions:

### For Custom Domain:
1. Purchase domain from provider (GoDaddy, Namecheap, etc.)
2. Go to Vercel Dashboard → Domains
3. Add your domain
4. Configure DNS settings as shown by Vercel

### For Vercel Subdomain:
1. Go to Vercel Dashboard → Settings
2. Change project name to get cleaner URL
3. Request specific subdomain if available

## DNS Configuration (for custom domain):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A  
Name: @
Value: 76.76.19.61
```
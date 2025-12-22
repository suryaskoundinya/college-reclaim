# Command Reference - College Reclaim

## 🚀 Quick Commands Cheat Sheet

### Git Commands (Version Control)

#### Check Status & Changes
```bash
# Check current status of your repository
git status

# View changes made to files
git diff

# View commit history
git log --oneline -10
```

#### Commit & Push Changes
```bash
# Stage all changes
git add .

# Stage specific file
git add <file-path>

# Commit with message
git commit -m "your commit message"

# Push to GitHub (triggers auto-deployment on Vercel)
git push origin main

# Quick commit and push (all in one)
git add . && git commit -m "your message" && git push origin main
```

#### Branch Management
```bash
# Create new branch
git checkout -b feature-name

# Switch to existing branch
git checkout branch-name

# List all branches
git branch -a

# Delete branch
git branch -d branch-name
```

#### Undo Changes
```bash
# Discard changes in a file
git restore <file-path>

# Unstage a file
git restore --staged <file-path>

# Reset to last commit (dangerous!)
git reset --hard HEAD

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

### Development Commands

#### Start Development Server
```bash
# Start dev server on localhost:3000
npm run dev

# or
pnpm dev

# or
yarn dev
```

#### Build & Production
```bash
# Build for production
npm run build

# Run production build locally
npm start

# Check for linting errors
npm run lint
```

#### Database Commands (Prisma)
```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push
```

---

### Deployment Commands

#### Vercel (Auto-deploys on git push to main)
```bash
# Manual deployment (if needed)
vercel deploy

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs
```

#### View Deployed App
Your app auto-deploys when you push to GitHub. Check:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: Check the "Actions" tab in your GitHub repo

---

### Package Management

#### Install Dependencies
```bash
# Install all dependencies
npm install

# Install specific package
npm install <package-name>

# Install as dev dependency
npm install -D <package-name>

# Update all packages
npm update
```

#### Remove Dependencies
```bash
# Uninstall package
npm uninstall <package-name>

# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Environment & Configuration

#### Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit environment variables
notepad .env
```

**Important**: Never commit `.env` file to Git!

---

### Testing & Quality

#### Run Tests (if configured)
```bash
npm test

# Run tests in watch mode
npm test -- --watch
```

#### Type Checking
```bash
# Check TypeScript errors
npx tsc --noEmit
```

---

### Utility Commands

#### Clean & Reset
```bash
# Clean Next.js cache
rm -rf .next

# Clean and rebuild
rm -rf .next node_modules package-lock.json && npm install && npm run build
```

#### Port Management (if port 3000 is busy)
```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or find and kill manually
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🔄 Common Workflows

### Daily Development Workflow
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Make your changes...

# 5. Check status
git status

# 6. Stage, commit, and push
git add .
git commit -m "feat: description of changes"
git push origin main
```

### Feature Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: your feature"

# 3. Push feature branch
git push origin feature/your-feature-name

# 4. Create Pull Request on GitHub
# 5. After merge, switch back to main
git checkout main
git pull origin main
```

### Database Schema Update Workflow
```bash
# 1. Edit prisma/schema.prisma

# 2. Create and apply migration
npx prisma migrate dev --name descriptive_migration_name

# 3. Generate Prisma Client
npx prisma generate

# 4. Restart dev server
npm run dev

# 5. Commit changes
git add .
git commit -m "db: migration description"
git push origin main
```

### Quick Fix & Deploy
```bash
# One-liner to commit and deploy
git add . && git commit -m "fix: your fix description" && git push origin main
```

---

## 📝 Commit Message Conventions

Use conventional commits for better history:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks
- `db:` - Database changes

**Examples:**
```bash
git commit -m "feat: add email notifications for matches"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update README with setup instructions"
git commit -m "db: add createdAt field to User model"
```

---

## 🆘 Troubleshooting Commands

### When things go wrong...

```bash
# Server won't start - kill port and restart
npx kill-port 3000
npm run dev

# Database issues - reset and resync
npx prisma migrate reset
npx prisma generate

# Module not found - reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# TypeScript errors - check and fix
npx tsc --noEmit

# Git conflicts - see conflicted files
git status
# Manually resolve conflicts, then:
git add .
git commit -m "resolve merge conflicts"
git push origin main

# Undo last commit but keep changes
git reset --soft HEAD~1

# Completely discard all local changes (careful!)
git reset --hard HEAD
git clean -fd
```

---

## 🌐 Useful URLs

- **Local Dev**: http://localhost:3000
- **GitHub Repo**: https://github.com/suryaskoundinya/college-reclaim
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 💡 Pro Tips

1. **Auto-deployment**: Vercel automatically deploys when you push to `main` branch
2. **Preview deployments**: Push to any branch to get a preview URL
3. **Environment variables**: Update on Vercel Dashboard > Settings > Environment Variables
4. **Logs**: Check Vercel Dashboard for deployment logs and errors
5. **Local testing**: Always test with `npm run build` before pushing
6. **Commit often**: Small, frequent commits are better than large ones
7. **Branch names**: Use descriptive names like `feature/user-auth` or `fix/email-bug`

---

## 🎯 Most Used Commands (Quick Reference)

```bash
# Start development
npm run dev

# Commit and push
git add . && git commit -m "your message" && git push origin main

# Database update
npx prisma migrate dev && npx prisma generate

# Check status
git status

# View logs
git log --oneline -5

# Build for production
npm run build
```

---

**Last Updated**: December 22, 2025

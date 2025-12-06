# 🚀 Complete Setup Guide for Prizely

Follow these steps exactly to get your application running with Neon PostgreSQL.

---

## Step 1: Get Your Neon Database Credentials

### 1.1 Sign up for Neon (FREE)
1. Go to https://neon.tech
2. Click "Sign Up" (it's completely free)
3. Sign up with GitHub, Google, or email

### 1.2 Create a New Project
1. Click "Create Project"
2. Give it a name (e.g., "prizely-db")
3. Select a region close to you
4. Click "Create"

### 1.3 Copy Your Connection String
1. After project creation, you'll see a connection string
2. It looks like this:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. Click the "Copy" button to copy it
4. **Save this somewhere safe!** You'll need it in the next step

---

## Step 2: Add Credentials to Your Project

### 2.1 Create .env File

**On Windows (PowerShell):**
```powershell
# In your project root directory
New-Item -Path .env -ItemType File
```

**On Mac/Linux (Terminal):**
```bash
# In your project root directory
touch .env
```

### 2.2 Add Your Database URL

Open the `.env` file you just created and add this line:

```env
DATABASE_URL="paste-your-connection-string-here"
```

**Example:**
```env
DATABASE_URL="postgresql://myuser:mypassword@ep-cool-mountain-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

⚠️ **Important:** 
- Keep the quotes around the connection string
- Don't share this file with anyone (it's already in .gitignore)
- Don't commit it to GitHub

---

## Step 3: Setup Your Database

Run these commands **in order**:

### 3.1 Generate Prisma Client
```bash
npm run db:generate
```
This creates the Prisma Client based on your schema.

### 3.2 Push Schema to Database
```bash
npm run db:push
```
This creates all the tables (Items, Markets, Prices) in your Neon database.

### 3.3 Seed Database with Sample Data
```bash
npm run db:seed
```
This adds:
- 20 grocery items (Sugar, Flour, Rice, etc.)
- 12 markets (Imtiaz, Carrefour, Metro, etc.)
- 240 prices (every item for every market)

You should see output like:
```
🌱 Starting seed...
🗑️  Clearing existing data...
📦 Seeding items...
   ✓ Created item: Sugar
   ✓ Created item: Flour
   ...
🏪 Seeding markets...
   ✓ Created market: Imtiaz
   ✓ Created market: Carrefour
   ...
💰 Seeding prices...
   ✓ Created 240 prices
✅ Seed completed successfully!
```

---

## Step 4: Run Your Application

```bash
npm run dev
```

Open your browser to: http://localhost:3000

🎉 **You're done!** Your app should now be working with a real database!

---

## 🛠️ Useful Commands

### View Your Database
```bash
npm run db:studio
```
This opens Prisma Studio - a visual database browser at http://localhost:5555

### Re-seed Database
If you want to reset all data to the sample data:
```bash
npm run db:seed
```

### Check Database Connection
```bash
npx prisma db pull
```
This will fail if your connection string is wrong.

---

## ❌ Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
- Make sure your `.env` file exists in the project root
- Make sure it contains `DATABASE_URL="your-connection-string"`
- Restart your dev server after creating/editing `.env`

### Error: "Can't reach database server"
- Check your internet connection
- Verify your Neon database is active in the Neon dashboard
- Make sure your connection string is correct
- Check if your Neon project is suspended (free tier auto-suspends after inactivity)

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Database is empty
```bash
npm run db:seed
```

### Want to start fresh?
```bash
# Clear and re-seed
npm run db:seed
```

---

## 🎯 What's Next?

After setup, you can:

1. **Compare Prices**: Go to http://localhost:3000 and start comparing
2. **Manage Items**: Visit http://localhost:3000/admin/items
3. **Manage Markets**: Visit http://localhost:3000/admin/markets
4. **Manage Prices**: Visit http://localhost:3000/admin/prices

---

## 📞 Still Having Issues?

1. Make sure all dependencies are installed: `npm install`
2. Delete `node_modules` and reinstall: 
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Check your Node.js version: `node --version` (should be 18+)
4. Check the Neon dashboard to ensure your database is active

---

Happy price comparing! 🛒💰


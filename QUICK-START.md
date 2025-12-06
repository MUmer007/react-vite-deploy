# ⚡ Quick Start - 5 Minutes Setup

## 1️⃣ Get Neon Database (2 minutes)
1. Go to https://neon.tech → Sign up (FREE)
2. Create a new project
3. Copy your connection string (looks like):
   ```
   postgresql://user:pass@host.neon.tech/db?sslmode=require
   ```

## 2️⃣ Add to Your Project (1 minute)
Create a file named `.env` in your project root:
```env
DATABASE_URL="paste-your-connection-string-here"
```

## 3️⃣ Setup Database (2 minutes)
Run these commands:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## 4️⃣ Run! (30 seconds)
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🎯 That's it! Your app is now running with:
- ✅ 20 grocery items
- ✅ 12 markets
- ✅ 240 prices
- ✅ Full CRUD operations
- ✅ Real-time database

## 📍 Admin Pages:
- Items: http://localhost:3000/admin/items
- Markets: http://localhost:3000/admin/markets
- Prices: http://localhost:3000/admin/prices

---

**Need help?** See SETUP.md for detailed instructions.


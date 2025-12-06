# Prizely - Smart Grocery Price Comparison

A modern, full-stack web application built with Next.js and Prisma that helps users compare grocery prices across multiple markets to find the best deals and save money. Features a complete database-driven system with Neon PostgreSQL.

## Features

- 🛒 **Dynamic Price Comparison**: Compare prices across markets with real-time database queries
- 💰 **Savings Calculator**: See potential savings before making purchases
- 📊 **Visual Analytics**: Beautiful charts and statistics to analyze price differences
- ✓ **Verified Markets**: Filter for trusted, verified markets
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- 🎨 **Modern UI**: Built with Tailwind CSS and Framer Motion animations
- 🔍 **Search & Filter**: Quickly find items and markets with smart search
- 🗄️ **Full CRUD Operations**: Add, edit, and delete items, markets, and prices
- 🔐 **PostgreSQL Database**: Powered by Neon serverless PostgreSQL

## Tech Stack

- **Framework**: Next.js 15 (React 18)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript
- **API**: Next.js API Routes

## Quick Start Guide

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- A Neon PostgreSQL account (free tier available)

### Step 1: Get Your Neon PostgreSQL Database

1. Go to [Neon.tech](https://neon.tech) and sign up for free
2. Create a new project
3. Copy your connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### Step 2: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd react-vite-deploy

# Install dependencies
npm install
```

### Step 3: Configure Database

1. Create a `.env` file in the root directory:
```bash
# On Windows (PowerShell)
Copy-Item .env.local.example .env

# On Mac/Linux
cp .env.local.example .env
```

2. Open `.env` and add your Neon connection string:
```env
DATABASE_URL="postgresql://your-username:your-password@your-host.neon.tech/your-database?sslmode=require"
```

### Step 4: Setup Database

Run these commands to set up your database schema and seed it with sample data:

```bash
# Generate Prisma Client
npm run db:generate

# Push the schema to your database
npm run db:push

# Seed the database with sample data (20 items, 12 markets, 240 prices)
npm run db:seed
```

### Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

### Development
- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

### Database Management
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main price comparison page
│   ├── globals.css     # Global styles and Tailwind imports
│   └── favicon.ico     # App icon
├── public/             # Static assets
├── eslint.config.mjs   # ESLint configuration
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## How to Use

### For Users (Price Comparison)

1. **Select Items**: Choose grocery items you want to compare by clicking on them
2. **Select Markets**: Pick at least 2 markets to compare prices
3. **View Savings**: Check the potential savings calculator
4. **Compare**: Click "Compare Prices" to see detailed results
5. **Analyze**: View detailed price breakdowns, charts, and statistics
6. **Copy Report**: Export results as a text report

### For Admins (Data Management)

Click the "Manage" button in the header to access admin pages:

1. **Manage Items** (`/admin/items`)
   - Add new grocery items with name, unit, and emoji
   - Edit existing items
   - Delete items (also removes associated prices)

2. **Manage Markets** (`/admin/markets`)
   - Add new markets with name, rating, and verification status
   - Edit market details
   - Delete markets (also removes associated prices)

3. **Manage Prices** (`/admin/prices`)
   - Set prices for any item-market combination
   - View all prices in a matrix table
   - Update prices in real-time

## Database Schema

The application uses three main tables:

### Items
- `id` - Unique identifier
- `name` - Item name (unique)
- `unit` - Measurement unit (kg, liter, piece, etc.)
- `emoji` - Optional emoji icon
- `createdAt`, `updatedAt` - Timestamps

### Markets
- `id` - Unique identifier
- `name` - Market name (unique)
- `rating` - Star rating (0-5)
- `verified` - Verification status
- `createdAt`, `updatedAt` - Timestamps

### Prices
- `id` - Unique identifier
- `itemId` - Reference to Item
- `marketId` - Reference to Market
- `price` - Price value
- `createdAt`, `updatedAt` - Timestamps
- Unique constraint on (itemId, marketId) combination

## Troubleshooting

### "Database Not Connected" Error

If you see this error:
1. Check that your `.env` file exists and has the correct `DATABASE_URL`
2. Verify your Neon database is active
3. Run `npm run db:push` to ensure schema is synced
4. Run `npm run db:seed` to add sample data
5. Restart the development server

### Prisma Client Errors

If you encounter Prisma Client errors:
```bash
npm run db:generate
```

### Database Schema Changes

After modifying `prisma/schema.prisma`:
```bash
npm run db:push
npm run db:generate
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue in the GitHub repository.

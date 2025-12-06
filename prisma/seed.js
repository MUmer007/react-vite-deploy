const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_ITEMS = [
  { name: "Sugar", unit: "kg", emoji: "🍚" },
  { name: "Flour", unit: "kg", emoji: "🌾" },
  { name: "Rice", unit: "kg", emoji: "🍚" },
  { name: "Milk", unit: "liter", emoji: "🥛" },
  { name: "Eggs", unit: "dozen", emoji: "🥚" },
  { name: "Cooking Oil", unit: "liter", emoji: "🛢️" },
  { name: "Butter", unit: "pack", emoji: "🧈" },
  { name: "Chicken", unit: "kg", emoji: "🍗" },
  { name: "Beef", unit: "kg", emoji: "🥩" },
  { name: "Potato", unit: "kg", emoji: "🥔" },
  { name: "Tomato", unit: "kg", emoji: "🍅" },
  { name: "Onion", unit: "kg", emoji: "🧅" },
  { name: "Apple", unit: "kg", emoji: "🍎" },
  { name: "Banana", unit: "dozen", emoji: "🍌" },
  { name: "Salt", unit: "kg", emoji: "🧂" },
  { name: "Tea", unit: "packet", emoji: "🍵" },
  { name: "Coffee", unit: "jar", emoji: "☕" },
  { name: "Detergent", unit: "kg", emoji: "🧺" },
  { name: "Soap", unit: "piece", emoji: "🧼" },
  { name: "Toothpaste", unit: "tube", emoji: "🪥" },
];

const DEFAULT_MARKETS = [
  { name: "Imtiaz", rating: 4.6, verified: true },
  { name: "Carrefour", rating: 4.5, verified: true },
  { name: "Chase Up", rating: 4.2, verified: false },
  { name: "Metro", rating: 4.4, verified: true },
  { name: "Al-Fatah", rating: 4.0, verified: false },
  { name: "Utility Store", rating: 3.8, verified: false },
  { name: "Hyperstar", rating: 4.1, verified: false },
  { name: "FreshMart", rating: 3.9, verified: false },
  { name: "Naheed", rating: 4.0, verified: false },
  { name: "Green Valley", rating: 4.0, verified: false },
  { name: "Madina Cash & Carry", rating: 3.8, verified: false },
  { name: "Jalal Sons", rating: 4.2, verified: false },
];

// Sample prices for each item across markets
const SAMPLE_PRICES = {
  "Sugar": [150, 160, 155, 170, 153, 158, 165, 151, 152, 154, 158, 149],
  "Flour": [120, 118, 122, 125, 119, 121, 123, 117, 118, 119, 122, 120],
  "Rice": [190, 195, 185, 200, 188, 192, 198, 187, 186, 189, 191, 184],
  "Milk": [120, 125, 118, 130, 121, 123, 127, 119, 122, 121, 124, 120],
  "Eggs": [210, 215, 205, 220, 208, 199, 212, 202, 205, 207, 209, 200],
  "Cooking Oil": [420, 430, 415, 440, 418, 425, 435, 410, 412, 420, 428, 419],
  "Butter": [250, 260, 255, 270, 248, 252, 265, 249, 251, 253, 257, 245],
  "Chicken": [480, 495, 470, 500, 478, 475, 490, 469, 472, 475, 485, 468],
  "Beef": [900, 920, 890, 940, 905, 895, 915, 888, 892, 898, 910, 885],
  "Potato": [40, 45, 42, 48, 41, 43, 44, 39, 40, 41, 42, 38],
  "Tomato": [90, 95, 88, 99, 92, 93, 97, 87, 88, 89, 90, 86],
  "Onion": [70, 72, 68, 75, 69, 71, 73, 67, 68, 69, 70, 66],
  "Apple": [220, 230, 210, 240, 218, 225, 235, 215, 217, 219, 223, 205],
  "Banana": [120, 125, 115, 130, 118, 121, 126, 117, 116, 119, 122, 114],
  "Salt": [40, 45, 44, 49, 43, 42, 46, 41, 42, 43, 44, 40],
  "Tea": [500, 520, 495, 540, 510, 505, 525, 490, 492, 503, 515, 485],
  "Coffee": [480, 500, 470, 510, 495, 490, 505, 468, 472, 478, 498, 460],
  "Detergent": [350, 360, 340, 370, 345, 348, 355, 338, 342, 346, 352, 335],
  "Soap": [60, 65, 58, 68, 62, 61, 64, 57, 59, 60, 63, 56],
  "Toothpaste": [120, 125, 118, 130, 121, 122, 127, 116, 117, 119, 123, 115],
};

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.price.deleteMany();
  await prisma.item.deleteMany();
  await prisma.market.deleteMany();

  // Seed items
  console.log('📦 Seeding items...');
  const items = [];
  for (const item of DEFAULT_ITEMS) {
    const created = await prisma.item.create({
      data: item,
    });
    items.push(created);
    console.log(`   ✓ Created item: ${item.name}`);
  }

  // Seed markets
  console.log('🏪 Seeding markets...');
  const markets = [];
  for (const market of DEFAULT_MARKETS) {
    const created = await prisma.market.create({
      data: market,
    });
    markets.push(created);
    console.log(`   ✓ Created market: ${market.name}`);
  }

  // Seed prices
  console.log('💰 Seeding prices...');
  let priceCount = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemPrices = SAMPLE_PRICES[item.name];
    
    if (itemPrices) {
      for (let j = 0; j < markets.length; j++) {
        const market = markets[j];
        const price = itemPrices[j];
        
        await prisma.price.create({
          data: {
            itemId: item.id,
            marketId: market.id,
            price: price,
          },
        });
        priceCount++;
      }
    }
  }
  console.log(`   ✓ Created ${priceCount} prices`);

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


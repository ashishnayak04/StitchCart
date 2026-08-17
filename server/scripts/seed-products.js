require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

const products = [
  /* ---------- MEN'S EDIT ---------- */
  { title: "Rich Fit Italian Wool Suit", category: "men", brand: "raymond", price: 24999, salePrice: 32999, totalStock: 24, averageReview: 4.9, description: "Super 130s Italian Merino wool, hand-finished lapels. The quiet-money wardrobe staple.", image: img("photo-1507679799987-c73779587ccf") },
  { title: "Navy Double-Breasted Blazer", category: "men", brand: "raymond", price: 18999, salePrice: 24999, totalStock: 32, averageReview: 4.9, description: "Sharp, clean and structured — the blazer that reads rich instantly.", image: img("photo-1519085360753-af0119f7cbe7") },
  { title: "Slim-Fit Oxford Poplin Shirt", category: "men", brand: "louis-philippe", price: 3999, salePrice: 4999, totalStock: 80, averageReview: 4.7, description: "Fine cotton poplin with a clean slim silhouette. Effortless by design.", image: img("photo-1520975954732-35dd22299614") },
  { title: "Old Money Cashmere Polo", category: "men", brand: "ralph-lauren", price: 5499, salePrice: 6999, totalStock: 45, averageReview: 4.8, description: "Grade-A cashmere with a relaxed collar. Understated luxury.", image: img("photo-1506794778202-cad84cf45f1d") },
  { title: "Quiet Luxury Overcoat", category: "men", brand: "hugo-boss", price: 29999, salePrice: 39999, totalStock: 12, averageReview: 4.9, description: "Heavyweight virgin wool overcoat in a muted camel tone.", image: img("photo-1500648767791-00dcc994a43e") },
  { title: "White Structured Tee", category: "men", brand: "armani", price: 2999, salePrice: 3999, totalStock: 120, averageReview: 4.6, description: "Heavyweight cotton tee with a perfect clean drape.", image: img("photo-1521119989659-a83eee488004") },
  { title: "Heritage Wool Trench", category: "men", brand: "massimo-dutti", price: 21999, salePrice: 27999, totalStock: 14, averageReview: 4.8, description: "Classic trench silhouette in a premium wool blend.", image: img("photo-1594633312681-425c7b97ccd1") },
  { title: "The Rich Man's Knit", category: "men", brand: "hugo-boss", price: 9499, salePrice: 12999, totalStock: 38, averageReview: 4.8, description: "Fine-rib merino knitwear — clean lines, zero noise.", image: img("photo-1531384441138-2736e62e0919") },

  /* ---------- WOMEN'S EDIT ---------- */
  { title: "Ivory Silk Midi Dress", category: "women", brand: "massimo-dutti", price: 16999, salePrice: 21999, totalStock: 26, averageReview: 4.8, description: "Pure silk crepe with a peak satin collar. Pure quiet luxury.", image: img("photo-1524504388940-b1c1722653e1") },
  { title: "Sculpted Power Blazer", category: "women", brand: "armani", price: 15999, salePrice: 19999, totalStock: 30, averageReview: 4.8, description: "Sharp shoulders, clean waist — tailoring that commands the room.", image: img("photo-1487412720507-e7ab37603c6f") },
  { title: "Clean White Top", category: "women", brand: "armani", price: 3999, salePrice: 4999, totalStock: 90, averageReview: 4.7, description: "Crisp structured white top — the clean aesthetic essential.", image: img("photo-1523381210434-271e8be1f52b") },
  { title: "Silk Slip Dress", category: "women", brand: "ralph-lauren", price: 13999, salePrice: 17999, totalStock: 22, averageReview: 4.8, description: "Weightless mulberry silk with an effortless drape.", image: img("photo-1517841905240-472988babdf9") },
  { title: "Cashmere Wrap Coat", category: "women", brand: "hugo-boss", price: 27999, salePrice: 35999, totalStock: 10, averageReview: 4.9, description: "Belted pure cashmere coat in a soft neutral.", image: img("photo-1559268950-2d7ceb2efa3a") },
  { title: "Pleated Midi Skirt", category: "women", brand: "massimo-dutti", price: 6999, salePrice: 8999, totalStock: 40, averageReview: 4.7, description: "Evening pleats in a satin finish. Moves beautifully.", image: img("photo-1488426862026-3ee34a7d66df") },
  { title: "Evening Silk Dress", category: "women", brand: "gucci", price: 21999, salePrice: 27999, totalStock: 15, averageReview: 4.9, description: "Show-stopping silk in a rich tone. Money, made visible.", image: img("photo-1509967419530-da38b4704bc6") },
  { title: "The Rich Girl Fit Jeans", category: "women", brand: "armani", price: 5999, salePrice: 7999, totalStock: 60, averageReview: 4.7, description: "High-rise clean-fit denim that flatters every angle.", image: img("photo-1587836374828-4dbafa94cf0e") },

  /* ---------- KIDS EDIT ---------- */
  { title: "Mini Coach Jacket Set", category: "kids", brand: "tommy-hilfiger", price: 3999, salePrice: 4999, totalStock: 50, averageReview: 4.8, description: "Organic cotton twill coach jacket in a matching set. Mini rich, full flex.", image: img("photo-1519238263530-99bdd11df2ea") },
  { title: "Little Rich Boy Suit", category: "kids", brand: "raymond", price: 4999, salePrice: 6499, totalStock: 35, averageReview: 4.8, description: "Full mini suit for the littlest old-money energy.", image: img("photo-1476703993599-0035a21b17a9") },
  { title: "Baby Cashmere Romper", category: "kids", brand: "ralph-lauren", price: 2499, salePrice: 3299, totalStock: 70, averageReview: 4.9, description: "Buttery-soft cashmere-blend romper for tiny heirs.", image: img("photo-1503454537195-1dcabb73ffb9") },
  { title: "Kids Heritage Knit Set", category: "kids", brand: "hugo-boss", price: 3499, salePrice: 4499, totalStock: 55, averageReview: 4.7, description: "Matching knit set built for play, styled for photo days.", image: img("photo-1471286174890-9c112ffca5b4") },

  /* ---------- SHIRTS ---------- */
  { title: "Custom-Fit Oxford Shirt", category: "shirts", brand: "louis-philippe", price: 3999, salePrice: 4999, totalStock: 85, averageReview: 4.7, description: "Classic oxford with a modern custom fit.", image: img("photo-1611312449408-fcece27cdbb7") },
  { title: "Luxe Linen Shirt", category: "shirts", brand: "tommy-hilfiger", price: 4499, salePrice: 5499, totalStock: 60, averageReview: 4.7, description: "Breathable premium linen — the rich summer essential.", image: img("photo-1620012253295-c15cc3e65df4") },
  { title: "Formal Poplin Shirt", category: "shirts", brand: "raymond", price: 3499, salePrice: 4499, totalStock: 95, averageReview: 4.6, description: "Crisp poplin with a clean pressed collar.", image: img("photo-1596755094514-f87e34085b2c") },
  { title: "Crisp White Dress Shirt", category: "shirts", brand: "louis-philippe", price: 4199, salePrice: 5299, totalStock: 75, averageReview: 4.7, description: "The white shirt every rich wardrobe needs.", image: img("photo-1624378439575-d8705ad7ae80") },

  /* ---------- PANTS & CHINOS ---------- */
  { title: "Pleated Wool Trousers", category: "trousers", brand: "allen-solly", price: 5999, salePrice: 7999, totalStock: 45, averageReview: 4.7, description: "Single-pleat wool trousers with a clean break.", image: img("photo-1565084888279-aca607ecce0c") },
  { title: "Clean-Fit Chinos", category: "trousers", brand: "tommy-hilfiger", price: 4499, salePrice: 5999, totalStock: 70, averageReview: 4.6, description: "Tailored chinos in premium cotton twill.", image: img("photo-1591195853828-11db59a44f6b") },
  { title: "Raw Selvedge Jeans", category: "trousers", brand: "ralph-lauren", price: 8999, salePrice: 11999, totalStock: 30, averageReview: 4.8, description: "Japanese selvedge denim that ages beautifully.", image: img("photo-1541099649105-f69ad21f3246") },
  { title: "Tailored Slim Pants", category: "trousers", brand: "massimo-dutti", price: 6999, salePrice: 8999, totalStock: 42, averageReview: 4.7, description: "Slim-cut trousers in a soft wool blend.", image: img("photo-1473966968600-fa801b869a1a") },
  { title: "Relaxed Denim Jeans", category: "trousers", brand: "armani", price: 6499, salePrice: 8499, totalStock: 55, averageReview: 4.6, description: "Relaxed clean-fit denim — everyday rich.", image: img("photo-1584865288642-42078afe6942") },

  /* ---------- LUXURY WATCHES ---------- */
  { title: "Skeleton Automatic Chronograph", category: "watches", brand: "fossil", price: 79999, salePrice: 99999, totalStock: 8, averageReview: 4.9, description: "Swiss automatic movement under sapphire crystal.", image: img("photo-1542496658-e33a6d0d50f6") },
  { title: "Swiss Leather Chrono", category: "watches", brand: "fossil", price: 54999, salePrice: 69999, totalStock: 12, averageReview: 4.9, description: "Full-grain leather strap with a precise chronograph.", image: img("photo-1524592094714-0f0654e20314") },
  { title: "Minimal Steel Watch", category: "watches", brand: "armani", price: 34999, salePrice: 44999, totalStock: 16, averageReview: 4.8, description: "Clean dial, brushed steel — quiet luxury on the wrist.", image: img("photo-1533139502658-0198f920d8e8") },
  { title: "Heritage Gold Watch", category: "watches", brand: "gucci", price: 94999, salePrice: 119999, totalStock: 5, averageReview: 4.9, description: "Gold-tone heritage piece for the money-forward moments.", image: img("photo-1547996160-81dfa63595aa") },
  { title: "Classic Dress Watch", category: "watches", brand: "fossil", price: 24999, salePrice: 31999, totalStock: 20, averageReview: 4.7, description: "A slim dress watch that disappears under a cuff.", image: img("photo-1523170335258-f5ed11844a49") },
  { title: "Italian Mesh Watch", category: "watches", brand: "armani", price: 29999, salePrice: 37999, totalStock: 14, averageReview: 4.8, description: "Mesh-link Italian bracelet with a sunburst dial.", image: img("photo-1434056886845-dac89ffe9b56") },
  { title: "Premium Chronograph", category: "watches", brand: "fossil", price: 44999, salePrice: 57999, totalStock: 10, averageReview: 4.8, description: "Three-counter chronograph with exhibition caseback.", image: img("photo-1522312346375-d1a52e2b99b3") },
  { title: "Everyday Steel Watch", category: "watches", brand: "armani", price: 19999, salePrice: 25999, totalStock: 25, averageReview: 4.6, description: "The go-anywhere steel everyday piece.", image: img("photo-1508057198894-247b23fe5ade") },

  /* ---------- SHOES & SNEAKERS ---------- */
  { title: "Court Classic Heritage Sneakers", category: "shoes", brand: "nike", price: 12499, salePrice: 15999, totalStock: 28, averageReview: 4.9, description: "Premium leather court sneaker with handcrafted sole.", image: img("photo-1549298916-b41d501d3772") },
  { title: "Air Retro Statement Kicks", category: "shoes", brand: "nike", price: 14999, salePrice: 18999, totalStock: 20, averageReview: 4.9, description: "Retro silhouette that stops every room.", image: img("photo-1542291026-7eec264c27ff") },
  { title: "Street Luxe Sneakers", category: "shoes", brand: "nike", price: 12999, salePrice: 16999, totalStock: 24, averageReview: 4.8, description: "Clean street profile, luxurious build.", image: img("photo-1560769629-975ec94e6a86") },
  { title: "Minimal White Court", category: "shoes", brand: "nike", price: 10999, salePrice: 13999, totalStock: 35, averageReview: 4.8, description: "The minimalist white shoe that pairs with everything.", image: img("photo-1595950653106-6c9ebd614d3a") },
  { title: "Premium Leather Sneakers", category: "shoes", brand: "puma", price: 9999, salePrice: 12999, totalStock: 40, averageReview: 4.7, description: "Soft nappa leather with a cushioned footbed.", image: img("photo-1525966222134-fcfa99b8ae77") },
  { title: "City Sneaker", category: "shoes", brand: "puma", price: 8499, salePrice: 10999, totalStock: 45, averageReview: 4.6, description: "Everyday sneaker built for the city rich.", image: img("photo-1600185365483-26d7a4cc7519") },
  { title: "Heritage Runner", category: "shoes", brand: "nike", price: 13499, salePrice: 16999, totalStock: 22, averageReview: 4.8, description: "Retro runner with premium materials.", image: img("photo-1614252369475-531eba835eb1") },
  { title: "Classic Court Trainers", category: "shoes", brand: "nike", price: 11999, salePrice: 14999, totalStock: 30, averageReview: 4.7, description: "Timeless court trainer, updated for the modern rich.", image: img("photo-1595341888016-a392ef81b7de") },

  /* ---------- LUXURY ACCESSORIES ---------- */
  { title: "Gold Aviator Sunglasses", category: "accessories", brand: "gucci", price: 14999, salePrice: 18999, totalStock: 25, averageReview: 4.8, description: "Gold-frame aviators with polarized lenses.", image: img("photo-1572635196237-14b3f281503f") },
  { title: "Polarized Shades", category: "accessories", brand: "ralph-lauren", price: 11999, salePrice: 14999, totalStock: 30, averageReview: 4.7, description: "Clean acetate frames, crystal-clear vision.", image: img("photo-1511499767150-a48a237f0083") },
  { title: "Quilted Leather Bag", category: "accessories", brand: "gucci", price: 24999, salePrice: 31999, totalStock: 12, averageReview: 4.9, description: "Quilted lambskin bag — the flex that speaks.", image: img("photo-1584917865442-de89df76afd3") },
  { title: "Leather Weekender", category: "accessories", brand: "massimo-dutti", price: 19999, salePrice: 25999, totalStock: 15, averageReview: 4.8, description: "Full-grain leather weekender for the rich getaway.", image: img("photo-1553062407-98eeb64c6a62") },
  { title: "Structured Handbag", category: "accessories", brand: "armani", price: 17999, salePrice: 22999, totalStock: 18, averageReview: 4.8, description: "Clean structured silhouette, premium hardware.", image: img("photo-1548036328-c9fa89d128fa") },
  { title: "Full-Grain Leather Belt", category: "accessories", brand: "hugo-boss", price: 6999, salePrice: 8999, totalStock: 50, averageReview: 4.7, description: "Italian leather with a polished brass buckle.", image: img("photo-1551028719-00167b16eac5") },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const titles = products.map((p) => p.title);
    const deleted = await Product.deleteMany({ title: { $in: titles } });
    console.log(`Removed ${deleted.deletedCount} existing seed products`);

    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();

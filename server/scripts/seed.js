require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");

const CATEGORIES = [
  { id: "blazers", label: "Blazers & Tailoring", caption: "Super 130s wools, structured shoulders & bespoke cuts", image: "/products/wool-atelier-suit.jpg", count: "42 styles", department: "Tailoring" },
  { id: "shirts", label: "Shirts & Formals", caption: "Egyptian cottons, pinpoint oxfords & spread collars", image: "/products/oxford-formal-shirt.jpg", count: "68 styles", department: "Essentials" },
  { id: "dresses", label: "Dresses & Skirts", caption: "Heavy-weight silk crepes, pleated midis & cocktail gowns", image: "/products/silk-crepe-dress.jpg", count: "54 styles", department: "Womenswear" },
  { id: "trousers", label: "Trousers & Chinos", caption: "Double-pleated wool trousers & tapered stretch chinos", image: "/products/wool-trousers.jpg", count: "38 styles", department: "Tailoring" },
  { id: "knitwear", label: "Fine Knitwear", caption: "Grade-A Mongolian cashmere & extrafine merino turtlenecks", image: "/products/merino-turtleneck.jpg", count: "29 styles", department: "Knitwear" },
  { id: "outerwear", label: "Coats & Outerwear", caption: "Double-breasted trench coats & camel hair overcoats", image: "/products/wool-trench-coat.jpg", count: "24 styles", department: "Outerwear" },
  { id: "watches", label: "Luxury Timepieces", caption: "Automatic movements, sapphire crystal & alligator leather", image: "/products/automatic-chronograph.jpg", count: "18 styles", department: "Horology" },
  { id: "shoes", label: "Shoes & Footwear", caption: "Handcrafted calfskin Oxfords & heritage court brogues", image: "/products/calfskin-brogues.jpg", count: "35 styles", department: "Footwear" }
];

const BRANDS = [
  { id: "raymond", label: "Raymond Atelier", tag: "Heritage Tailoring", style: "font-serif font-semibold tracking-tight" },
  { id: "louis-philippe", label: "Louis Philippe", tag: "Upper Crest", style: "font-serif italic font-medium" },
  { id: "ralph-lauren", label: "Ralph Lauren", tag: "Purple Label", style: "font-black tracking-[0.2em]" },
  { id: "hugo-boss", label: "Hugo Boss", tag: "Black Edition", style: "font-extrabold tracking-widest" },
  { id: "massimo-dutti", label: "Massimo Dutti", tag: "Limited Studio", style: "font-light tracking-[0.24em]" },
  { id: "armani", label: "Armani Exchange", tag: "Contemporary", style: "italic font-serif font-medium" },
  { id: "fossil", label: "Fossil Atelier", tag: "Accessories", style: "font-sans" },
  { id: "allen-solly", label: "Allen Solly", tag: "Casual", style: "font-sans" }
];

const DEMO_CATALOG_PRODUCTS = [
  { id: "p1", title: "Italian Wool Tailored Suit", brand: "raymond", category: "blazers", price: 24999, salePrice: 18999, rating: 4.9, reviews: 148, image: "/products/wool-atelier-suit.jpg", description: "Super 130s Italian Wool, Structured Slim Cut", totalStock: 12 },
  { id: "p2", title: "Pinpoint Oxford Formal Shirt", brand: "louis-philippe", category: "shirts", price: 4999, salePrice: 3999, rating: 4.8, reviews: 284, image: "/products/oxford-formal-shirt.jpg", description: "100% 2-Ply Giza Cotton, Tailored Spread Collar", totalStock: 45 },
  { id: "p3", title: "Ivory Silk Crepe Pleated Midi", brand: "massimo-dutti", category: "dresses", price: 21999, salePrice: 16999, rating: 4.9, reviews: 192, image: "/products/silk-crepe-dress.jpg", description: "100% Mulberry Silk Crepe, Fluid Column Silhouette", totalStock: 8 },
  { id: "p4", title: "Double-Pleated Wool Trousers", brand: "allen-solly", category: "trousers", price: 7999, salePrice: 5999, rating: 4.7, reviews: 167, image: "/products/wool-trousers.jpg", description: "Tropical Worsted Wool, Relaxed Tapered Leg", totalStock: 22 },
  { id: "p5", title: "Ribbed Merino Turtleneck", brand: "ralph-lauren", category: "knitwear", price: 18999, salePrice: 14499, rating: 4.8, reviews: 116, image: "/products/merino-turtleneck.jpg", description: "100% Extrafine Merino Wool, Classic Fit", totalStock: 15 },
  { id: "p6", title: "Skeleton Automatic Chronograph", brand: "fossil", category: "watches", price: 99999, salePrice: 79999, rating: 5.0, reviews: 214, image: "/products/automatic-chronograph.jpg", description: "316L Steel & Sapphire, 41mm Case / 20mm Lug", totalStock: 5 },
  { id: "p7", title: "Handcrafted Calfskin Brogues", brand: "raymond", category: "shoes", price: 15999, salePrice: 12499, rating: 4.9, reviews: 310, image: "/products/calfskin-brogues.jpg", description: "Full Grain Italian Calfskin, Goodyear Welted", totalStock: 18 },
  { id: "p8", title: "Double-Breasted Wool Trench", brand: "hugo-boss", category: "outerwear", price: 42999, salePrice: 34999, rating: 4.9, reviews: 88, image: "/products/wool-trench-coat.jpg", description: "Heavy Melton Wool, Structured Overcoat", totalStock: 9 }
];

const VALID_COUPONS = [
  { code: "ATELIER20", discountType: "percentage", discountValue: 20, minPurchaseAmount: 5000, description: "20% off orders above ₹5,000" },
  { code: "FESTIVE15", discountType: "fixed", discountValue: 1500, minPurchaseAmount: 8000, description: "₹1,500 flat discount on orders above ₹8,000" },
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, minPurchaseAmount: 2000, description: "10% off your first StitchCart purchase" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing data...");
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Coupon.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    console.log("Existing data cleared.");

    console.log("Inserting categories...");
    const categoryDocs = CATEGORIES.map((cat, i) => ({
      name: cat.label,
      slug: cat.id,
      description: cat.caption,
      image: cat.image,
      isActive: true,
      sortOrder: i
    }));
    await Category.insertMany(categoryDocs);
    console.log(`Inserted ${categoryDocs.length} categories.`);

    console.log("Inserting brands...");
    const brandDocs = BRANDS.map((brand, i) => ({
      name: brand.label,
      slug: brand.id,
      description: brand.tag,
      isActive: true,
      sortOrder: i
    }));
    await Brand.insertMany(brandDocs);
    console.log(`Inserted ${brandDocs.length} brands.`);

    console.log("Inserting products...");
    const productDocs = DEMO_CATALOG_PRODUCTS.map(p => ({
      title: p.title,
      description: p.description,
      image: p.image,
      category: p.category,
      brand: p.brand,
      price: p.price,
      salePrice: p.salePrice,
      totalStock: p.totalStock,
      averageReview: p.rating
    }));
    await Product.insertMany(productDocs);
    console.log(`Inserted ${productDocs.length} products.`);

    console.log("Inserting coupons...");
    const couponDocs = VALID_COUPONS.map(c => ({
      code: c.code,
      discountType: c.discountType === "percentage" ? "percent" : c.discountType,
      discountValue: c.discountValue,
      minimumCartValue: c.minPurchaseAmount,
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // valid for 1 year
      isActive: true,
      description: c.description
    }));
    await Coupon.insertMany(couponDocs);
    console.log(`Inserted ${couponDocs.length} coupons.`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

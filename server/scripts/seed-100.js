require("dotenv").config();
const mongoose = require("mongoose");
const https = require("https");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Policy = require("../models/Policy");
const FAQ = require("../models/FAQ");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

// Map real API categories to our database categories
function mapCategory(sourceCat, title = "") {
  const t = title.toLowerCase();
  if (sourceCat === "mens-shirts") return "shirts";
  if (sourceCat === "womens-dresses") return "dresses";
  if (sourceCat === "tops") {
    return t.includes("dress") || t.includes("frock") ? "dresses" : "shirts";
  }
  if (sourceCat === "mens-clothing") {
    if (t.includes("jacket") || t.includes("coat")) return "outerwear";
    if (t.includes("shirt") || t.includes("tee")) return "shirts";
    return "shirts";
  }
  if (sourceCat === "womens-clothing") {
    if (t.includes("jacket") || t.includes("coat") || t.includes("windbreaker")) return "outerwear";
    if (t.includes("dress")) return "dresses";
    return "shirts";
  }
  if (sourceCat === "mens-shoes" || sourceCat === "womens-shoes") return "shoes";
  if (sourceCat === "mens-watches" || sourceCat === "womens-watches") return "watches";
  if (sourceCat === "womens-bags") return "outerwear";
  if (sourceCat === "sunglasses" || sourceCat === "womens-jewellery" || sourceCat === "fragrances") {
    return "knitwear";
  }
  return "shirts";
}

const BRANDS = [
  "raymond",
  "hugo-boss",
  "armani",
  "massimo-dutti",
  "louis-philippe",
  "ralph-lauren",
  "allen-solly",
  "fossil",
];

// ─── POLICIES ────────────────────────────────────────────────────────────────
const POLICIES = [
  {
    slug: "return-policy",
    title: "Return & Exchange Policy",
    content: `# Return & Exchange Policy

## Overview
At StitchCart, we want you to be completely satisfied with your purchase. If for any reason you are not happy, we offer a hassle-free return and exchange policy.

## Eligibility
- Items must be returned within **15 days** of delivery.
- Products must be **unworn, unwashed, and in original condition** with all tags attached.
- Items purchased on sale or during special promotions are eligible for exchange only, not refunds.

## How to Initiate a Return
1. Log in to your StitchCart account and navigate to **My Orders**.
2. Select the order and click **Request Return/Exchange**.
3. Our team will review and approve within 24–48 hours.
4. A free pickup will be scheduled at your address.

## Refund Timeline
Refunds are processed within **5–7 business days** after inspection, credited to the original payment method.

## Non-Returnable Items
Custom tailored garments, undergarments, and gift cards.`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `# Privacy Policy

StitchCart is committed to protecting your personal information. We collect only what is necessary to fulfil your orders and improve your shopping experience.

## What We Collect
- Name, email, phone, and delivery address
- Payment info (handled securely via Stripe — we never store card details)
- Browsing behaviour for product recommendations

## How We Use It
To process orders, send updates, personalise recommendations, and respond to support queries.

## Your Rights
You may request access, correction, or deletion of your data at privacy@stitchcart.in at any time.`,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    content: `# Terms & Conditions

By using StitchCart you agree to these terms. You must be 18+ to make purchases. Prices are in INR inclusive of taxes. We reserve the right to modify prices and reject orders. All content is the intellectual property of StitchCart. Disputes are subject to the jurisdiction of courts in Bangalore, Karnataka, India.`,
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    content: `# Shipping Policy

## Delivery Times
- **Standard:** 4–7 business days (Pan-India)
- **Express:** 1–2 business days (metro cities)

## Charges
- Free shipping on orders above ₹2,000
- ₹99 flat fee on orders below ₹2,000
- Express delivery: +₹199

## Tracking
Once dispatched, you'll receive a tracking link via email and SMS. Track from **My Orders** in your account.`,
  },
];

// ─── FAQS ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { question: "How do I place an order?", answer: "Browse collections, add to cart, and checkout securely using card, UPI, or PayPal.", category: "orders", sortOrder: 1 },
  { question: "Can I cancel my order?", answer: "Orders can be cancelled within 1 hour of placement. After that, they enter processing and cannot be cancelled.", category: "orders", sortOrder: 2 },
  { question: "How do I track my order?", answer: "Go to My Orders in your account. You'll also receive email and SMS tracking updates once the order is dispatched.", category: "orders", sortOrder: 3 },
  { question: "What payment methods do you accept?", answer: "Visa, Mastercard, RuPay, UPI (GPay, PhonePe, Paytm), Net Banking, and PayPal. All secured with 256-bit SSL.", category: "payments", sortOrder: 1 },
  { question: "Is it safe to save my card details?", answer: "Yes. We use tokenisation via Stripe (PCI-DSS Level 1). Your actual card number is never stored on our servers.", category: "payments", sortOrder: 2 },
  { question: "Do you offer EMI?", answer: "Yes, EMI is available on orders above ₹5,000 for eligible credit cards from HDFC, ICICI, SBI, and Axis Bank.", category: "payments", sortOrder: 3 },
  { question: "How long does delivery take?", answer: "Standard: 4–7 business days. Express (metro cities): 1–2 business days.", category: "shipping", sortOrder: 1 },
  { question: "Is there free shipping?", answer: "Yes! Free shipping on all orders above ₹2,000.", category: "shipping", sortOrder: 2 },
  { question: "Do you ship internationally?", answer: "Currently we only deliver within India. International shipping is coming soon.", category: "shipping", sortOrder: 3 },
  { question: "What is your return policy?", answer: "15-day returns for unworn items with original tags. Sale items are exchange-only. Initiate from My Orders.", category: "returns", sortOrder: 1 },
  { question: "How long do refunds take?", answer: "5–7 business days after we receive and inspect the return. COD orders get a bank transfer refund.", category: "returns", sortOrder: 2 },
  { question: "Can I exchange for a different size?", answer: "Yes, size exchanges are free. Initiate from My Orders and we'll arrange a free pickup and re-delivery.", category: "returns", sortOrder: 3 },
  { question: "How do I find my size?", answer: "Each product page has a size guide with measurements. Compare your measurements with the size chart for the best fit.", category: "products", sortOrder: 1 },
  { question: "Are product colours accurate?", answer: "We aim for accuracy, but slight variations may occur due to screen settings. You can return if unsatisfied.", category: "products", sortOrder: 2 },
  { question: "How do I care for my garments?", answer: "Care instructions are on the label inside each garment. Wool and silk items should be dry-cleaned; cotton can be cold machine-washed.", category: "products", sortOrder: 3 },
  { question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page, enter your email, and follow the reset link sent to your inbox.", category: "account", sortOrder: 1 },
  { question: "Can I save multiple addresses?", answer: "Yes, save multiple addresses in your account under 'Address Book' and choose one at checkout.", category: "account", sortOrder: 2 },
];

async function seedApparelAndFashion() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Fetch from all fashion/clothing/apparel endpoints
    const dummyCats = [
      "mens-shirts",
      "womens-dresses",
      "tops",
      "mens-shoes",
      "womens-shoes",
      "mens-watches",
      "womens-watches",
      "womens-bags",
      "sunglasses",
      "womens-jewellery",
      "fragrances",
    ];

    console.log("Fetching clothing and dresses from DummyJSON & FakeStoreAPI...");
    const dummyResults = await Promise.all(
      dummyCats.map((cat) =>
        fetchJson(`https://dummyjson.com/products/category/${cat}?limit=10`)
          .then((data) => data.products.map((p) => ({ ...p, _sourceCat: cat })))
          .catch(() => [])
      )
    );

    let rawProducts = dummyResults.flat();

    // Fetch Men's & Women's clothing from FakeStoreAPI
    try {
      const [fakeMens, fakeWomens] = await Promise.all([
        fetchJson("https://fakestoreapi.com/products/category/men%27s%20clothing"),
        fetchJson("https://fakestoreapi.com/products/category/women%27s%20clothing"),
      ]);

      if (Array.isArray(fakeMens)) {
        fakeMens.forEach((p) => {
          rawProducts.push({
            title: p.title,
            description: p.description,
            thumbnail: p.image,
            price: p.price,
            discountPercentage: 12,
            stock: 25,
            rating: p.rating?.rate || 4.2,
            _sourceCat: "mens-clothing",
          });
        });
      }

      if (Array.isArray(fakeWomens)) {
        fakeWomens.forEach((p) => {
          rawProducts.push({
            title: p.title,
            description: p.description,
            thumbnail: p.image,
            price: p.price,
            discountPercentage: 15,
            stock: 30,
            rating: p.rating?.rate || 4.3,
            _sourceCat: "womens-clothing",
          });
        });
      }
    } catch (e) {
      console.log("Could not fetch supplementary clothes:", e.message);
    }

    console.log(`Fetched total ${rawProducts.length} verified clothing, dress and lifestyle products.`);

    const categories = await Category.find({});
    const brands = await Brand.find({});

    if (categories.length === 0 || brands.length === 0) {
      console.error("Run seed.js first to create categories and brands.");
      process.exit(1);
    }

    const catMap = {};
    categories.forEach((c) => {
      catMap[c.slug] = c.slug;
    });
    const brandMap = {};
    brands.forEach((b) => {
      brandMap[b.slug] = b.slug;
    });

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    const productDocs = rawProducts.map((p, idx) => {
      const categorySlug = mapCategory(p._sourceCat, p.title);
      const brandSlug = BRANDS[idx % BRANDS.length];
      const basePrice = Math.round(p.price * 85);
      const salePrice = p.discountPercentage
        ? Math.round(basePrice * (1 - p.discountPercentage / 100))
        : basePrice;

      return {
        title: p.title,
        description: p.description,
        image: p.thumbnail || (p.images && p.images[0]),
        category: catMap[categorySlug] || categorySlug,
        brand: brandMap[brandSlug] || brandSlug,
        price: basePrice,
        salePrice,
        totalStock: p.stock || 25,
        averageReview: Number((p.rating || 4.2).toFixed(1)),
      };
    });

    await Product.insertMany(productDocs);
    console.log(`✓ Successfully seeded ${productDocs.length} real clothing, dress & fashion products.`);

    // Policies
    await Policy.deleteMany({});
    await Policy.insertMany(POLICIES);
    console.log(`✓ Inserted ${POLICIES.length} policies.`);

    // FAQs
    await FAQ.deleteMany({});
    await FAQ.insertMany(FAQS);
    console.log(`✓ Inserted ${FAQS.length} FAQs.`);

    console.log("\n✅ All done! Database seeded with extensive Men & Women dresses and apparel.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedApparelAndFashion();
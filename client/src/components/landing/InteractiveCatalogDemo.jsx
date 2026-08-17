import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Eye,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import { DEMO_CATALOG_PRODUCTS } from "./data";

const CATEGORY_TABS = [
  { id: "all", label: "All Drops" },
  { id: "blazers", label: "Tailoring" },
  { id: "shirts", label: "Shirts" },
  { id: "dresses", label: "Dresses" },
  { id: "knitwear", label: "Knitwear" },
  { id: "watches", label: "Timepieces" },
  { id: "shoes", label: "Footwear" },
];

function InteractiveCatalogDemo() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [addedIds, setAddedIds] = useState({});

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModalProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModalProduct]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveModalProduct(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter products
  const filteredProducts = DEMO_CATALOG_PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === "all" || prod.category === selectedCategory;
    const matchesBrand =
      selectedBrand === "all" ||
      prod.brand.toLowerCase().includes(selectedBrand.toLowerCase());
    const matchesSearch =
      searchQuery.trim() === "" ||
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return b.rating - a.rating;
  });

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    window.dispatchEvent(new CustomEvent("landing:add-to-cart"));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  return (
    <section id="collection" className="py-20 sm:py-28 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
          <SectionHeader
            number="02"
            eyebrow="Interactive Storefront Demo"
            title="Explore the live catalog with real-time filters."
            description="Experience StitchCart's ultra-fast faceted filtering, material breakdown, and responsive quick-view before entering the live store."
          />

          <Link
            to="/shop/listing"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-espresso hover:text-accent border-b border-espresso hover:border-accent pb-1 transition-colors self-start lg:self-end"
          >
            <span>Launch Complete Catalog (1,200+ Styles)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Filter Bar */}
        <div className="bg-surface-raised border border-border p-3.5 sm:p-5 shadow-1 mb-8">
          <div className="flex flex-col lg:flex-row gap-3.5 sm:gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cashmere, Italian wool, shirts, silk..."
                className="w-full h-11 pl-10 pr-8 bg-surface border border-border text-xs sm:text-sm text-espresso placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-espresso p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Department Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none -mx-1 px-1">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 sm:px-3.5 py-2 text-xs uppercase tracking-[0.14em] font-medium whitespace-nowrap transition-all active:scale-95 ${
                    selectedCategory === tab.id
                      ? "bg-espresso text-ivory shadow-1"
                      : "bg-surface text-brown/80 hover:bg-surface-hover hover:text-espresso border border-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2 text-xs text-brown w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-muted text-[11px] uppercase tracking-[0.1em]">Sort:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-espresso font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Catalog Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => {
            const isAdded = !!addedIds[product.id];
            return (
              <motion.article
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col bg-surface-raised border border-border hover:border-accent/60 transition-all duration-base shadow-1"
              >
                {/* Product Image Box */}
                <div
                  onClick={() => setActiveModalProduct(product)}
                  className="relative aspect-[4/5] overflow-hidden bg-beige/30 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-slow ease-luxury group-hover:scale-105"
                  />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-espresso text-ivory text-[9px] sm:text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1 border border-ivory/20 shadow-1">
                    {product.badge}
                  </span>

                  {/* Quick View Trigger for Desktop hover & Touch tap */}
                  <div className="absolute inset-0 bg-espresso/30 opacity-0 group-hover:opacity-100 transition-opacity duration-base hidden sm:flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalProduct(product);
                      }}
                      className="px-4 py-2.5 bg-surface-raised text-espresso text-xs uppercase tracking-[0.14em] font-semibold flex items-center gap-2 shadow-2 hover:bg-gold hover:text-espresso transition-colors active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </button>
                  </div>
                </div>

                {/* Product Details Content */}
                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span className="overline text-accent text-[10px]">
                      {product.brand}
                    </span>
                    <span className="text-[10px] text-taupe font-medium">
                      {product.stock} in stock
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveModalProduct(product)}
                    className="font-serif text-base sm:text-lg text-espresso font-medium leading-snug truncate cursor-pointer hover:text-accent transition-colors"
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-muted mt-0.5 font-serif italic truncate">
                    Fabric: {product.material}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-3 h-3 fill-gold stroke-gold"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted font-medium">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-border gap-2">
                    <div>
                      <p className="font-serif text-lg sm:text-xl text-accent font-semibold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      {product.originalPrice && (
                        <p className="text-[10px] sm:text-xs text-muted line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Mobile Inspect Button */}
                      <button
                        onClick={() => setActiveModalProduct(product)}
                        aria-label={`View details of ${product.title}`}
                        className="sm:hidden w-9 h-9 flex items-center justify-center border border-border text-espresso hover:bg-surface-hover active:bg-beige"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Add to Bag Button */}
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        aria-label={`Add ${product.title} to bag`}
                        className={`h-9 px-3.5 flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition-all active:scale-95 ${
                          isAdded
                            ? "bg-sage text-white"
                            : "bg-espresso text-ivory hover:bg-gold hover:text-espresso"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                            <span>Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* In-Page Quick View Product Modal */}
        <AnimatePresence>
          {activeModalProduct && (
            <div
              onClick={() => setActiveModalProduct(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-surface-raised border border-border max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-3 grid grid-cols-1 md:grid-cols-12"
              >
                {/* Close Button with generous touch target */}
                <button
                  onClick={() => setActiveModalProduct(null)}
                  aria-label="Close product preview"
                  className="absolute top-3 right-3 z-20 min-w-[36px] min-h-[36px] w-9 h-9 flex items-center justify-center bg-surface-raised/95 border border-border text-espresso hover:text-accent active:bg-surface-hover shadow-1"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Left: Product Image */}
                <div className="md:col-span-5 bg-beige/30 aspect-[4/5] md:aspect-auto max-h-[320px] md:max-h-none overflow-hidden">
                  <img
                    src={activeModalProduct.image}
                    alt={activeModalProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right: Specifications */}
                <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-between space-y-5 sm:space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="overline text-accent text-xs">
                        {activeModalProduct.brand}
                      </span>
                      <span className="text-muted text-xs">·</span>
                      <span className="text-xs text-muted uppercase tracking-[0.1em]">
                        {activeModalProduct.categoryLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-espresso font-medium leading-snug">
                      {activeModalProduct.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-gold">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-3.5 h-3.5 fill-gold stroke-gold"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted font-medium">
                        {activeModalProduct.rating} ({activeModalProduct.reviews}{" "}
                        reviews)
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3 mt-3.5">
                      <span className="font-serif text-2xl sm:text-3xl text-accent font-semibold">
                        ₹{activeModalProduct.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs sm:text-sm text-muted line-through">
                        ₹{activeModalProduct.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] font-semibold text-sage uppercase tracking-[0.1em]">
                        Inclusive of GST
                      </span>
                    </div>

                    {/* Garment Highlights */}
                    <div className="mt-4 sm:mt-6 space-y-2 text-xs text-brown/90 border-t border-border pt-3.5 sm:pt-4">
                      <div className="flex justify-between py-1 border-b border-beige/60">
                        <span className="text-muted">Fabric Composition</span>
                        <span className="font-medium">
                          {activeModalProduct.material}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-beige/60">
                        <span className="text-muted">Silhouette / Cut</span>
                        <span className="font-medium">
                          {activeModalProduct.fit}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-beige/60">
                        <span className="text-muted">Delivery Timeline</span>
                        <span className="font-medium text-sage">
                          2–3 Days Pan-India Express
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-3 sm:pt-4 border-t border-border">
                    <button
                      onClick={(e) => {
                        handleAddToCart(activeModalProduct, e);
                        setActiveModalProduct(null);
                      }}
                      className="w-full min-h-[44px] py-3 bg-espresso text-ivory text-xs uppercase tracking-[0.16em] font-semibold hover:bg-gold hover:text-espresso transition-colors flex items-center justify-center gap-2 shadow-1 active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-gold" />
                      <span>Add to Bag &amp; Close</span>
                    </button>

                    <Link
                      to="/shop/listing"
                      className="w-full py-2 text-center text-xs uppercase tracking-[0.14em] font-semibold text-muted hover:text-espresso block"
                    >
                      View in Full Storefront →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default InteractiveCatalogDemo;

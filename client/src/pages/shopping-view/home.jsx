import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import bannerOne from "../../assets/banner-1.webp";
import bannerThree from "../../assets/banner-3.webp";

const categories = [
  { id: "men", label: "Men", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", description: "Tailored sophistication" },
  { id: "women", label: "Women", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", description: "Elegant refinement" },
  { id: "accessories", label: "Accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80", description: "The perfect finish" },
  { id: "footwear", label: "Footwear", image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80", description: "Walk with confidence" },
];

const brands = [
  { id: "nike", label: "Nike" },
  { id: "adidas", label: "Adidas" },
  { id: "puma", label: "Puma" },
  { id: "levi", label: "Levi's" },
  { id: "zara", label: "Zara" },
  { id: "h&m", label: "H&M" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const slides = featureImageList?.length > 0
    ? featureImageList
    : [{ image: bannerOne }, { image: bannerThree }];

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const heroProducts = productList?.slice(0, 4) || [];
  const storyRef = useRef(null);
  const craftRef = useRef(null);
  const emailRef = useRef(null);

  function scrollToSection(ref) {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleSubscribe() {
    const email = emailRef.current?.value?.trim();
    if (!email) {
      toast({ title: "Please enter your email address", variant: "destructive" });
      return;
    }
    toast({ title: "Thank you for subscribing!", description: `We'll keep you updated at ${email}` });
    if (emailRef.current) emailRef.current.value = "";
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={slide?.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-charcoal/60 via-luxury-charcoal/20 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-xl animate-fade-in-up">
              <Badge variant="new" className="mb-4 md:mb-6">New Collection</Badge>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-4 md:mb-6">
                Timeless
                <br />
                <span className="text-luxury-gold">Elegance</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/70 font-light mb-6 md:mb-10 max-w-md leading-relaxed">
                Discover our latest collection of meticulously crafted pieces designed for the discerning individual.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  className="bg-luxury-ivory text-luxury-charcoal hover:bg-white uppercase tracking-wider h-12 px-8 text-xs sm:text-sm"
                  onClick={() => navigate("/shop/listing")}
                >
                  Explore Collection
                </Button>
                <Button
                  variant="outline"
                  className="border-luxury-ivory/30 text-luxury-ivory hover:bg-white/10 uppercase tracking-wider h-12 px-8 text-xs sm:text-sm"
                  onClick={() => scrollToSection(storyRef)}
                >
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + slides.length) % slides.length
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % slides.length)
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-luxury-gold w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-luxury-gold">
            Curated For You
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-luxury-charcoal mt-4 mb-4">
            Featured Collections
          </h2>
          <div className="h-px w-12 bg-luxury-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.slice(0, 2).map((category) => (
            <div
              key={category.id}
              onClick={() => handleNavigateToListingPage(category, "category")}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-serif text-3xl text-white font-semibold mb-2">
                  {category.label}
                </h3>
                <p className="text-white/60 text-sm mb-4">{category.description}</p>
                <span className="inline-flex items-center text-xs uppercase tracking-wider text-luxury-gold group-hover:gap-2 transition-all">
                  Discover More <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {categories.slice(2).map((category) => (
            <div
              key={category.id}
              onClick={() => handleNavigateToListingPage(category, "category")}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-serif text-3xl text-white font-semibold mb-2">
                  {category.label}
                </h3>
                <p className="text-white/60 text-sm mb-4">{category.description}</p>
                <span className="inline-flex items-center text-xs uppercase tracking-wider text-luxury-gold group-hover:gap-2 transition-all">
                  Discover More <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section ref={storyRef} className="py-24 bg-luxury-cream">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-luxury-ivory p-6 hidden lg:flex flex-col justify-center">
              <span className="text-4xl font-serif font-bold text-luxury-gold">15+</span>
              <span className="text-xs uppercase tracking-wider text-luxury-taupe mt-1">Years of Craftsmanship</span>
            </div>
          </div>
          <div className="space-y-6">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-luxury-gold">
              Our Heritage
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-luxury-charcoal leading-tight">
              Crafted with Purpose,<br />Designed for Life
            </h2>
            <div className="h-px w-12 bg-luxury-gold" />
            <p className="text-luxury-taupe leading-relaxed">
              At StitchCart, we believe that true luxury lies in the details. Every piece in our collection is thoughtfully designed and meticulously crafted using the finest materials, ensuring that each garment not only looks exceptional but feels extraordinary.
            </p>
            <p className="text-luxury-taupe leading-relaxed">
              From our ateliers to your wardrobe, we are committed to timeless design, uncompromising quality, and sustainable practices that honor both people and planet.
            </p>
            <Button
              variant="outline"
              className="border-luxury-charcoal text-luxury-charcoal hover:bg-luxury-charcoal hover:text-luxury-ivory uppercase tracking-wider mt-4"
              onClick={() => toast({ title: "Our Heritage", description: "StitchCart was founded on the belief that true luxury is timeless. Each piece is crafted with care, designed to be cherished for generations." })}
            >
              Discover Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-luxury-gold">
              Editor's Pick
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-luxury-charcoal mt-4">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop/listing"
            className="hidden md:flex items-center text-sm uppercase tracking-wider text-luxury-taupe hover:text-luxury-charcoal transition-colors"
          >
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList && productList.length > 0
            ? productList.slice(0, 8).map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
        <div className="text-center mt-12 md:hidden">
          <Link
            to="/shop/listing"
            className="inline-flex items-center text-sm uppercase tracking-wider text-luxury-charcoal border-b border-luxury-charcoal pb-1"
          >
            View All Products <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="py-16 border-y border-luxury-beige/50 bg-luxury-ivory">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-luxury-taupe mb-10">
            Featured Brands
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                className="text-center group"
              >
                <p className="font-serif text-lg md:text-xl text-luxury-taupe group-hover:text-luxury-charcoal transition-colors">
                  {brand.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Section - Alternating */}
      <section ref={craftRef} className="py-24 bg-luxury-ivory">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-luxury-gold">
              The Art of Detail
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-luxury-charcoal leading-tight">
              Where Craftsmanship<br />Meets Design
            </h2>
            <div className="h-px w-12 bg-luxury-gold" />
            <p className="text-luxury-taupe leading-relaxed">
              Every stitch tells a story. Our master artisans bring decades of experience to each piece, ensuring impeccable construction and finish that stands the test of time.
            </p>
            <ul className="space-y-3">
              {["Premium Italian fabrics", "Hand-finished details", "Ethically produced"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-luxury-charcoal">
                  <span className="w-1 h-1 bg-luxury-gold rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="border-luxury-charcoal text-luxury-charcoal hover:bg-luxury-charcoal hover:text-luxury-ivory uppercase tracking-wider mt-4"
              onClick={() => scrollToSection(craftRef)}
            >
              Learn About Our Craft
            </Button>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-luxury-charcoal">
        <div className="max-w-[600px] mx-auto px-6 text-center space-y-8">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-luxury-gold">
            Stay Connected
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-luxury-ivory">
            Join Our World of<br />Timeless Elegance
          </h2>
          <p className="text-luxury-beige/60 text-sm leading-relaxed">
            Be the first to discover new collections, exclusive drops, and behind-the-scenes stories from our ateliers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              ref={emailRef}
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 bg-transparent border border-luxury-beige/30 px-4 text-sm text-luxury-ivory placeholder:text-luxury-beige/40 focus:outline-none focus:border-luxury-gold transition-colors"
            />
            <Button
              onClick={handleSubscribe}
              className="bg-luxury-gold text-luxury-charcoal hover:bg-luxury-gold/90 uppercase tracking-wider h-12 px-6 flex-shrink-0 w-full sm:w-auto"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-luxury-beige/30">
            By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;

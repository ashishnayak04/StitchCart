import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  { id: "men", label: "Men's Edit", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", description: "Sharp shirts, clean pants, quiet-money fits" },
  { id: "women", label: "Women's Edit", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", description: "Silk, sculpted tailoring & clean luxury" },
  { id: "kids", label: "Kids Edit", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80", description: "Mini versions of the rich look" },
  { id: "trousers", label: "Pants & Chinos", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", description: "Pleated wools & tailored chinos" },
  { id: "shirts", label: "Shirts & Formals", image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80", description: "Oxford cottons & luxury poplins" },
  { id: "watches", label: "Luxury Watches", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80", description: "Automatics & chronographs" },
  { id: "shoes", label: "Shoes & Sneakers", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", description: "Court classics & statement kicks" },
  { id: "accessories", label: "Luxury Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", description: "Sunglasses, belts & bags" },
];

const brands = [
  { id: "raymond", label: "Raymond" },
  { id: "gucci", label: "Gucci" },
  { id: "ralph-lauren", label: "Ralph Lauren" },
  { id: "hugo-boss", label: "Hugo Boss" },
  { id: "armani", label: "Armani Exchange" },
  { id: "nike", label: "Nike" },
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
            className={`absolute inset-0 transition-all duration-1000 ease-luxury ${
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
            <div className="absolute inset-0 bg-gradient-to-r from-espresso/60 via-espresso/20 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-xl animate-fade-in-up">
              <Badge variant="new" className="mb-4 md:mb-6">New Rich Drop · Live Now</Badge>
              <h1 className="display-xl text-white">
                Rich.
                <br />
                <span className="text-gold">Clean. Effortless.</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/70 font-light mb-6 md:mb-10 max-w-md leading-relaxed">
                Sharp shirts, tailored pants, luxury watches, heritage sneakers
                and quiet accessories — curated for men, women &amp; kids who
                dress for the super-rich aesthetic.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/shop/listing")}
                >
                  Explore Collection
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/60"
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
              className={`w-2 h-2 rounded-full transition-all duration-fast ${
                index === currentSlide
                  ? "bg-gold w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-16">
          <span className="overline text-accent">The Rich Drop</span>
          <h2 className="display-md text-foreground mt-4 mb-4">
            Featured Collections
          </h2>
          <div className="h-px w-12 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleNavigateToListingPage(category, "category")}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 ease-luxury group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-2xl text-white font-medium mb-1.5">
                  {category.label}
                </h3>
                <p className="text-white/60 text-sm mb-3">{category.description}</p>
                <span className="inline-flex items-center text-xs uppercase tracking-[0.12em] text-gold group-hover:gap-2 transition-all duration-fast">
                  Discover More <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section ref={storyRef} className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=800&q=80"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-surface-raised p-6 hidden lg:flex flex-col justify-center shadow-2">
              <span className="text-4xl font-serif font-medium text-accent">15+</span>
              <span className="overline text-muted mt-1">Years of Craftsmanship</span>
            </div>
          </div>
          <div className="space-y-6">
            <span className="overline text-accent">Our Heritage</span>
            <h2 className="display-lg text-foreground">
              The Rich Aesthetic,<br />Crafted to Perfection
            </h2>
            <div className="h-px w-12 bg-accent" />
            <p className="text-muted leading-relaxed">
              At StitchCart, rich isn&apos;t loud — it&apos;s clean. Every shirt, pant,
              watch and pair of sneakers in our drop is chosen for an
              effortless, super-rich finish: premium fabrics, honest
              construction and silhouettes that never go out of style.
            </p>
            <p className="text-muted leading-relaxed">
              From our ateliers to your wardrobe, we curate complete looks for
              men, women and kids — so dressing like the money is already made
              is just one checkout away.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-4"
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
            <span className="overline text-accent">Editor&apos;s Pick</span>
            <h2 className="display-md text-foreground mt-4">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop/listing"
            className="hidden md:flex items-center text-xs uppercase tracking-[0.12em] text-muted hover:text-foreground transition-colors"
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
            className="inline-flex items-center text-xs uppercase tracking-[0.12em] text-foreground border-b border-foreground pb-1"
          >
            View All Products <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="py-16 border-y border-border bg-surface-raised">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="overline text-center text-muted mb-10">
            Featured Brands
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                className="text-center group"
              >
                <p className="font-serif text-lg md:text-xl text-muted group-hover:text-foreground transition-colors">
                  {brand.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Section - Alternating */}
      <section ref={craftRef} className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <span className="overline text-accent">The Art of Detail</span>
            <h2 className="display-lg text-foreground">
              Where Clean Design<br />Meets Quiet Luxury
            </h2>
            <div className="h-px w-12 bg-accent" />
            <p className="text-muted leading-relaxed">
              Every piece in the drop — from tailored pants and oxford shirts
              to automatic watches and court sneakers — is refined to feel
              expensive without trying. Clean lines, premium materials, zero
              noise.
            </p>
            <ul className="space-y-3">
              {["Hand-finished tailoring & clean fits", "Luxury watches & premium leather", "Curated looks for men, women & kids"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="lg"
              className="mt-4"
              onClick={() => scrollToSection(craftRef)}
            >
              Learn About Our Craft
            </Button>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-espresso">
        <div className="max-w-[600px] mx-auto px-6 text-center space-y-8">
          <span className="overline text-gold">The Rich Drop</span>
          <h2 className="display-md text-ivory">
            First Access to New<br />Drops &amp; Rare Pieces
          </h2>
          <p className="text-ivory/60 text-sm leading-relaxed">
            Be first to shop the weekly rich drop — watches, sneakers, shirts
            and tailored pants before they sell out. Quiet, clean, considered.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              ref={emailRef}
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 bg-transparent border border-ivory/30 px-4 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors"
            />
            <Button
              variant="gold"
              size="lg"
              onClick={handleSubscribe}
              className="flex-shrink-0 w-full sm:w-auto"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-ivory/30">
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

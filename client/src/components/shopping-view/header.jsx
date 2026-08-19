import {
  LogOut, Menu, Search, ShoppingBag, User, Heart, ChevronDown,
  HelpCircle, MessageSquare, Bell, Star, ClipboardList,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";

const categories = [
  { id: "blazers", label: "Blazers" },
  { id: "shirts", label: "Shirts" },
  { id: "shoes", label: "Shoes" },
  { id: "accessories", label: "Accessories" },
  { id: "watches", label: "Watches" },
  { id: "dresses", label: "Dresses" },
];

function NavLinks() {
  const navigate = useNavigate();

  function handleCategoryNavigate(categoryId) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ category: [categoryId] }));
    navigate(`/shop/listing?category=${categoryId}`);
  }

  return (
    <nav className="hidden lg:flex items-center gap-8">
      <Link
        to="/shop/home"
        className="text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        Home
      </Link>
      <Link
        to="/shop/listing"
        onClick={() => {
          sessionStorage.removeItem("filters");
          sessionStorage.setItem("filters", JSON.stringify(null));
        }}
        className="text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        Shop
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors">
            Categories
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44 mt-2">
          {categories.map((cat) => (
            <DropdownMenuItem key={cat.id} onClick={() => handleCategoryNavigate(cat.id)}>
              {cat.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors">
            Help
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 mt-2">
          <DropdownMenuItem onClick={() => navigate("/shop/faq")}>
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shop/support")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Support
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate("/shop/search")}
        className="text-muted hover:text-foreground transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        onClick={() => navigate("/shop/wishlist")}
        className="text-muted hover:text-foreground transition-colors"
      >
        <Heart className="w-5 h-5" />
      </button>

      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <button
          onClick={() => setOpenCartSheet(true)}
          className="relative text-muted hover:text-foreground transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-medium flex items-center justify-center rounded-full">
              {cartItems?.items?.length}
            </span>
          )}
        </button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="outline-none">
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 mt-2">
          <div className="px-3 py-2 text-xs text-muted">
            {user?.userName}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/profile")}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shop/notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shop/loyalty")}>
            <Star className="mr-2 h-4 w-4" />
            Loyalty Points
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileNav() {
  const navigate = useNavigate();

  function handleCategoryNavigate(categoryId) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ category: [categoryId] }));
    navigate(`/shop/listing?category=${categoryId}`);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="mt-8 flex flex-col gap-6">
          <Link
            to="/shop/home"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop/listing"
            onClick={() => {
              sessionStorage.removeItem("filters");
              sessionStorage.setItem("filters", JSON.stringify(null));
            }}
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-muted">Categories</span>
            <div className="flex flex-col gap-2 pl-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryNavigate(cat.id)}
                  className="text-sm text-muted hover:text-foreground transition-colors text-left"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-muted">Help</span>
            <div className="flex flex-col gap-2 pl-2">
              <button
                onClick={() => navigate("/shop/faq")}
                className="text-sm text-muted hover:text-foreground transition-colors text-left"
              >
                FAQ
              </button>
              <button
                onClick={() => navigate("/shop/support")}
                className="text-sm text-muted hover:text-foreground transition-colors text-left"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ShoppingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-surface-raised/95 backdrop-blur-md shadow-1"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link to="/shop/home" className="flex-shrink-0">
            <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">
              StitchCart
            </h1>
          </Link>
        </div>

        <NavLinks />

        <div className="flex items-center">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

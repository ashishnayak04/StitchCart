import { LogOut, Menu, Search, ShoppingBag, User, Heart } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
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

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-8">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <button
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors uppercase tracking-[0.12em]"
        >
          {menuItem.label}
        </button>
      ))}
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
        <DropdownMenuContent align="end" className="w-48 mt-2">
          <div className="px-3 py-2 text-xs text-muted">
            {user?.userName}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <User className="mr-2 h-4 w-4" />
            Account
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
        <Link to="/shop/home" className="flex-shrink-0">
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">
            StitchCart
          </h1>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="mt-8">
              <MenuItems />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex items-center gap-12">
          <MenuItems />
        </div>

        <div className="flex items-center">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

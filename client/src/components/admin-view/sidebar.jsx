import { LayoutDashboard, ShoppingBag, Package, ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <Package className="w-5 h-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6 space-y-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <button
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen && setOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all ${
              isActive
                ? "bg-luxury-charcoal text-luxury-ivory"
                : "text-luxury-taupe hover:bg-luxury-cream hover:text-luxury-charcoal"
            }`}
          >
            <div className="flex items-center gap-3">
              {menuItem.icon}
              <span className="font-medium">{menuItem.label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-0"}`} />
          </button>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-luxury-ivory p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-luxury-beige/50">
            <SheetTitle className="font-serif text-xl text-luxury-charcoal">
              StitchCart
            </SheetTitle>
            <p className="text-xs text-luxury-taupe uppercase tracking-wider">Admin Panel</p>
          </SheetHeader>
          <div className="px-4">
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 flex-col border-r border-luxury-beige/50 bg-luxury-ivory lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex flex-col px-6 pt-6 pb-4 border-b border-luxury-beige/50 cursor-pointer"
        >
          <h1 className="font-serif text-xl font-semibold text-luxury-charcoal">
            StitchCart
          </h1>
          <p className="text-xs text-luxury-taupe uppercase tracking-wider mt-1">Admin Panel</p>
        </div>
        <div className="px-4">
          <MenuItems />
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;

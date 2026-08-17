import { LayoutDashboard, ShoppingBag, Package, Tag, ChevronRight, BarChart3, Users, Star, MessageSquare, HelpCircle, FileText, ClipboardList, Layers, FolderTree, Building2, Warehouse, RotateCcw, Shield } from "lucide-react";
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
  {
    id: "coupons",
    label: "Coupons",
    path: "/admin/coupons",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/admin/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "reviews",
    label: "Reviews",
    path: "/admin/reviews",
    icon: <Star className="w-5 h-5" />,
  },
  {
    id: "support",
    label: "Support",
    path: "/admin/support",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "faq",
    label: "FAQ",
    path: "/admin/faq",
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    id: "policies",
    label: "Policies",
    path: "/admin/policies",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "audit",
    label: "Audit Log",
    path: "/admin/audit",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    id: "categories",
    label: "Categories",
    path: "/admin/categories",
    icon: <FolderTree className="w-5 h-5" />,
  },
  {
    id: "brands",
    label: "Brands",
    path: "/admin/brands",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "variants",
    label: "Variants",
    path: "/admin/variants",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: "inventory",
    label: "Inventory",
    path: "/admin/inventory",
    icon: <Warehouse className="w-5 h-5" />,
  },
  {
    id: "returns",
    label: "Returns",
    path: "/admin/returns",
    icon: <RotateCcw className="w-5 h-5" />,
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
            className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-fast ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted hover:bg-surface-hover hover:text-foreground"
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
        <SheetContent side="left" className="w-72 bg-surface-raised p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <SheetTitle className="font-serif text-xl text-foreground">
              StitchCart
            </SheetTitle>
            <p className="overline text-muted">Admin Panel</p>
          </SheetHeader>
          <div className="px-4">
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 flex-col border-r border-border bg-surface-raised lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex flex-col px-6 pt-6 pb-4 border-b border-border cursor-pointer"
        >
          <h1 className="font-serif text-xl font-semibold text-foreground">
            StitchCart
          </h1>
          <p className="overline text-muted mt-1">Admin Panel</p>
        </div>
        <div className="px-4">
          <MenuItems />
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;

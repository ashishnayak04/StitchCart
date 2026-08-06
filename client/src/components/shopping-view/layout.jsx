import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ShoppingHeader />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <ShoppingFooter />
    </div>
  );
}

export default ShoppingLayout;

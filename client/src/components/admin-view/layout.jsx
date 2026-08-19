import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const dispatch = useDispatch();

  // Pre-fetch core data as soon as the admin area is entered.
  // This prevents the "blank page until hard refresh" issue caused by
  // Suspense unmount/remount racing with the initial useEffect inside each page.
  useEffect(() => {
    dispatch(fetchAllProducts({ page: 1, limit: 20 }));
    dispatch(getAllOrdersForAdmin({ page: 1, limit: 15 }));
  }, [dispatch]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 p-6 lg:p-8 bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

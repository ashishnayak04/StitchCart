import AdminOrdersView from "@/components/admin-view/orders";

function AdminOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-luxury-charcoal">
          Orders
        </h1>
        <p className="text-sm text-luxury-taupe mt-1">
          Manage customer orders
        </p>
      </div>
      <AdminOrdersView />
    </div>
  );
}

export default AdminOrders;

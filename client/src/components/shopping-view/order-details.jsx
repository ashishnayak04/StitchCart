import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Package } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "bg-luxury-gold/10 text-luxury-brown border-luxury-gold/20",
      pending: "bg-luxury-cream text-luxury-taupe border-luxury-beige",
      rejected: "bg-red-50 text-red-600 border-red-100",
      delivered: "bg-green-50 text-green-700 border-green-100",
    };
    return variants[status] || "bg-luxury-cream text-luxury-taupe";
  };

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-[600px] bg-luxury-ivory">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-luxury-cream rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-luxury-gold" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-luxury-charcoal">
              Order Details
            </h2>
            <p className="text-sm text-luxury-taupe">
              #{orderDetails?._id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Order Date</Label>
            <p className="text-sm text-luxury-charcoal mt-1">
              {orderDetails?.orderDate?.split("T")[0]}
            </p>
          </div>
          <div>
            <Label>Total Amount</Label>
            <p className="text-sm font-serif font-semibold text-luxury-charcoal mt-1">
              ₹{orderDetails?.totalAmount}
            </p>
          </div>
          <div>
            <Label>Payment Method</Label>
            <p className="text-sm text-luxury-charcoal mt-1 capitalize">
              {orderDetails?.paymentMethod}
            </p>
          </div>
          <div>
            <Label>Payment Status</Label>
            <p className="text-sm text-luxury-charcoal mt-1 capitalize">
              {orderDetails?.paymentStatus}
            </p>
          </div>
          <div>
            <Label>Order Status</Label>
            <div className="mt-1">
              <Badge
                variant="outline"
                className={getStatusBadge(orderDetails?.orderStatus)}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-serif text-lg font-semibold text-luxury-charcoal mb-4">
            Items
          </h3>
          <div className="space-y-3">
            {orderDetails?.cartItems?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-luxury-beige/30 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-luxury-cream overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-luxury-charcoal font-medium">
                      {item.title}
                    </p>
                    <p className="text-xs text-luxury-taupe">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-luxury-charcoal">
                  ₹{item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-serif text-lg font-semibold text-luxury-charcoal mb-3">
            Shipping Address
          </h3>
          <div className="text-sm text-luxury-taupe space-y-1">
            <p className="text-luxury-charcoal font-medium">{user?.userName}</p>
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}</p>
            <p>Pincode: {orderDetails?.addressInfo?.pincode}</p>
            <p>Phone: {orderDetails?.addressInfo?.phone}</p>
            {orderDetails?.addressInfo?.notes && (
              <p className="italic">Notes: {orderDetails?.addressInfo?.notes}</p>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;

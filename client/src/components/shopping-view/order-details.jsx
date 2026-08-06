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
      confirmed: "bg-accent/10 text-brown border-accent/20",
      pending: "bg-surface text-muted border-border",
      rejected: "bg-danger/10 text-danger border-danger/20",
      delivered: "bg-sage/20 text-success-foreground border-sage/30",
    };
    return variants[status] || "bg-surface text-muted";
  };

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-[600px] bg-surface-raised">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="heading text-foreground">Order Details</h2>
            <p className="text-sm text-muted">
              #{orderDetails?._id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Order Date</Label>
            <p className="text-sm text-foreground mt-1">
              {orderDetails?.orderDate?.split("T")[0]}
            </p>
          </div>
          <div>
            <Label>Total Amount</Label>
            <p className="text-sm font-serif font-semibold text-foreground mt-1">
              ${orderDetails?.totalAmount}
            </p>
          </div>
          <div>
            <Label>Payment Method</Label>
            <p className="text-sm text-foreground mt-1 capitalize">
              {orderDetails?.paymentMethod}
            </p>
          </div>
          <div>
            <Label>Payment Status</Label>
            <p className="text-sm text-foreground mt-1 capitalize">
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
          <h3 className="heading text-foreground mb-4">Items</h3>
          <div className="space-y-3">
            {orderDetails?.cartItems?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">
                  ${item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="heading text-foreground mb-3">Shipping Address</h3>
          <div className="text-sm text-muted space-y-1">
            <p className="text-foreground font-medium">{user?.userName}</p>
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

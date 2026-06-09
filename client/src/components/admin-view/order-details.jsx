import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { Package } from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({ title: data?.payload?.message });
      }
    });
  }

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "bg-luxury-gold/10 text-luxury-brown border-luxury-gold/20",
      pending: "bg-luxury-cream text-luxury-taupe border-luxury-beige",
      rejected: "bg-red-50 text-red-600 border-red-100",
      delivered: "bg-green-50 text-green-700 border-green-100",
      inProcess: "bg-blue-50 text-blue-600 border-blue-100",
      inShipping: "bg-purple-50 text-purple-600 border-purple-100",
    };
    return variants[status] || "bg-luxury-cream text-luxury-taupe";
  };

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-[600px] bg-luxury-ivory max-h-[80vh] overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-luxury-cream rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-luxury-gold" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-luxury-charcoal">
              Order Details
            </h2>
            <p className="text-sm text-luxury-taupe font-mono">
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
            <Label>Total</Label>
            <p className="text-sm font-serif font-semibold text-luxury-charcoal mt-1">
              ₹{orderDetails?.totalAmount}
            </p>
          </div>
          <div>
            <Label>Payment</Label>
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
                    <p className="text-sm text-luxury-charcoal font-medium">{item.title}</p>
                    <p className="text-xs text-luxury-taupe">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-medium">₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-serif text-lg font-semibold text-luxury-charcoal mb-3">
            Shipping
          </h3>
          <div className="text-sm text-luxury-taupe space-y-1">
            <p className="text-luxury-charcoal font-medium">{user?.userName}</p>
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}</p>
            <p>Pincode: {orderDetails?.addressInfo?.pincode}</p>
            <p>Phone: {orderDetails?.addressInfo?.phone}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-serif text-lg font-semibold text-luxury-charcoal mb-3">
            Update Status
          </h3>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Status"
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;

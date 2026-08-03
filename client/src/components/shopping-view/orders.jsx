import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { Eye } from "lucide-react";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  function handleDialogOpenChange(open) {
    setOpenDetailsDialog(open);
    if (!open) dispatch(resetOrderDetails());
  }

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "bg-luxury-gold/10 text-luxury-brown border-luxury-gold/20",
      pending: "bg-luxury-cream text-luxury-taupe border-luxury-beige",
      rejected: "bg-red-50 text-red-600 border-red-100",
      delivered: "bg-green-50 text-green-700 border-green-100",
    };
    return variants[status] || "bg-luxury-cream text-luxury-taupe";
  };

  return (
    <div>
      {orderList && orderList.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell className="font-mono text-xs">
                      {orderItem?._id?.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {orderItem?.orderDate?.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusBadge(orderItem?.orderStatus)}`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-serif font-semibold whitespace-nowrap">
                      ₹{orderItem?.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {orderList.map((orderItem) => (
              <div
                key={orderItem._id}
                className="border border-luxury-beige/50 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-luxury-taupe">
                    #{orderItem?._id?.slice(-8)}
                  </span>
                  <Badge
                    variant="outline"
                    className={`${getStatusBadge(orderItem?.orderStatus)}`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-luxury-taupe">Date</span>
                  <span className="text-luxury-charcoal">
                    {orderItem?.orderDate?.split("T")[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-luxury-taupe">Total</span>
                  <span className="font-serif font-semibold text-luxury-charcoal">
                    ₹{orderItem?.totalAmount}
                  </span>
                </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs uppercase tracking-wider"
                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-luxury-taupe">No orders yet</p>
        </div>
      )}

      <Dialog open={openDetailsDialog} onOpenChange={handleDialogOpenChange}>
        <ShoppingOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </div>
  );
}

export default ShoppingOrders;

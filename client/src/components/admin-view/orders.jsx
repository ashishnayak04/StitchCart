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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Eye } from "lucide-react";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

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

  return (
    <div className="bg-white border border-luxury-beige/50">
      <div className="p-6 border-b border-luxury-beige/50">
        <h2 className="font-serif text-xl font-semibold text-luxury-charcoal">
          All Orders
        </h2>
      </div>
      <div className="p-6">
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
                          className={getStatusBadge(orderItem?.orderStatus)}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-serif font-semibold whitespace-nowrap">
                        ₹{orderItem?.totalAmount}
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
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
                      className={getStatusBadge(orderItem?.orderStatus)}
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
                  <Dialog
                    open={openDetailsDialog}
                    onOpenChange={() => {
                      setOpenDetailsDialog(false);
                      dispatch(resetOrderDetails());
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs uppercase tracking-wider"
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <AdminOrderDetailsView orderDetails={orderDetails} />
                  </Dialog>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-luxury-taupe">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersView;

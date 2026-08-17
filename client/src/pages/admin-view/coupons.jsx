import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import CommonForm from "@/components/common/form";
import { couponFormControls } from "@/config";
import {
  addNewCoupon,
  deleteCoupon,
  editCoupon,
  fetchAllCoupons,
  toggleCouponActive,
} from "@/store/admin/coupons-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Tag, Percent, Power, Pencil, Trash2 } from "lucide-react";

const initialFormData = {
  code: "",
  description: "",
  discountType: "percent",
  discountValue: "",
  minimumCartValue: "",
  expirationDate: "",
  usageLimit: "",
};

function AdminCoupons() {
  const [openCreateCouponDialog, setOpenCreateCouponDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { couponList } = useSelector((state) => state.adminCoupon);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(editCoupon({ id: currentEditedId, formData })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllCoupons());
          setFormData(initialFormData);
          setOpenCreateCouponDialog(false);
          setCurrentEditedId(null);
          toast({ title: "Coupon updated successfully" });
        } else {
          toast({
            title: data?.payload?.message || "Failed to update coupon",
            variant: "destructive",
          });
        }
      });
    } else {
      dispatch(addNewCoupon(formData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllCoupons());
          setFormData(initialFormData);
          setOpenCreateCouponDialog(false);
          toast({ title: "Coupon added successfully" });
        } else {
          toast({
            title: data?.payload?.message || "Failed to add coupon",
            variant: "destructive",
          });
        }
      });
    }
  }

  function handleToggle(couponId) {
    dispatch(toggleCouponActive(couponId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCoupons());
        toast({ title: "Coupon status updated" });
      }
    });
  }

  function handleDelete(couponId) {
    dispatch(deleteCoupon(couponId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCoupons());
        toast({ title: "Coupon deleted" });
      }
    });
  }

  function isFormValid() {
    return (
      formData.code !== "" &&
      formData.discountValue !== "" &&
      formData.discountType !== ""
    );
  }

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading text-foreground">Coupons</h1>
          <p className="text-sm text-muted mt-1">
            {couponList?.length || 0} coupons
          </p>
        </div>
        <Button
          onClick={() => setOpenCreateCouponDialog(true)}
          className="uppercase"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {couponList && couponList.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {couponList.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-surface-raised border border-border p-5 shadow-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground uppercase">
                    {coupon.code}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {coupon.description || "No description"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 ${
                    coupon.isActive
                      ? "bg-accent/10 text-accent"
                      : "bg-muted/30 text-muted"
                  }`}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                {coupon.discountType === "percent" ? (
                  <Percent className="w-4 h-4 text-accent" />
                ) : (
                  <Tag className="w-4 h-4 text-accent" />
                )}
                <span>
                  {coupon.discountType === "percent"
                    ? `${coupon.discountValue}% off`
                    : `₹${coupon.discountValue} off`}
                </span>
              </div>

              <div className="text-xs text-muted space-y-1 mb-4">
                {coupon.minimumCartValue > 0 && (
                  <p>Min. cart: ₹{coupon.minimumCartValue}</p>
                )}
                {coupon.expirationDate && (
                  <p>Expires: {new Date(coupon.expirationDate).toLocaleDateString()}</p>
                )}
                {coupon.usageLimit > 0 && (
                  <p>Used: {coupon.usedCount} / {coupon.usageLimit}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggle(coupon._id)}
                >
                  <Power className="w-4 h-4 mr-2" />
                  {coupon.isActive ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentEditedId(coupon._id);
                    setFormData({
                      code: coupon.code,
                      description: coupon.description || "",
                      discountType: coupon.discountType,
                      discountValue: coupon.discountValue,
                      minimumCartValue: coupon.minimumCartValue || "",
                      expirationDate: coupon.expirationDate
                        ? coupon.expirationDate.split("T")[0]
                        : "",
                      usageLimit: coupon.usageLimit || "",
                    });
                    setOpenCreateCouponDialog(true);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(coupon._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border">
          <Tag className="w-12 h-12 text-beige mx-auto mb-4" />
          <p className="text-muted">No coupons yet</p>
          <Button
            variant="outline"
            onClick={() => setOpenCreateCouponDialog(true)}
            className="mt-4"
          >
            Add your first coupon
          </Button>
        </div>
      )}

      <Sheet
        open={openCreateCouponDialog}
        onOpenChange={() => {
          setOpenCreateCouponDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto bg-surface-raised w-full sm:max-w-lg"
        >
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="font-serif text-xl">
              {currentEditedId !== null ? "Edit Coupon" : "Add New Coupon"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update" : "Add Coupon"}
              formControls={couponFormControls}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminCoupons;

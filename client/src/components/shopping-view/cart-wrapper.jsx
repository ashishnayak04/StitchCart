import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-surface-raised">
      <SheetHeader className="border-b border-border pb-4">
        <SheetTitle className="font-serif text-2xl">Shopping Bag</SheetTitle>
        <p className="text-sm text-muted">
          {cartItems?.length || 0} {cartItems?.length === 1 ? "item" : "items"}
        </p>
      </SheetHeader>
      <div className="mt-6 space-y-4 flex-1 overflow-y-auto max-h-[50vh]">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, idx) => (
            <UserCartItemsContent key={idx} cartItem={item} />
          ))
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-beige mx-auto mb-4" />
            <p className="text-sm text-muted">Your bag is empty</p>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted uppercase tracking-[0.12em]">
              Subtotal
            </span>
            <span className="font-serif text-xl font-semibold text-foreground">
              ${totalCartAmount}
            </span>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full uppercase"
            size="lg"
          >
            Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;

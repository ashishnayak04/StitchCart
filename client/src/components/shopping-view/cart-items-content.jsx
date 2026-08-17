import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];
      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );
        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex]?.totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart updated" });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Item removed from cart" });
      }
    });
  }

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-surface">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-base font-medium text-foreground truncate">
          {cartItem?.title}
        </h4>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            disabled={cartItem?.quantity === 1}
            className="w-7 h-7 border border-border flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-30"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium text-foreground w-4 text-center">
            {cartItem?.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
            className="w-7 h-7 border border-border flex items-center justify-center hover:bg-surface transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <span className="font-serif font-semibold text-foreground">
          ₹
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(0)}
        </span>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-muted hover:text-danger transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;

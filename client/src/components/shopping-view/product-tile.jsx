import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { useState, useEffect } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const { toast } = useToast();
  const [inWishlist, setInWishlist] = useState(false);
  const hasSale = product?.salePrice > 0;
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setInWishlist(wishlist.includes(product?._id));
  }, [product?._id]);

  function handleWishlistToggle(e) {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (inWishlist) {
      const updated = wishlist.filter((id) => id !== product?._id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setInWishlist(false);
      toast({ title: "Removed from wishlist" });
    } else {
      wishlist.push(product?._id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setInWishlist(true);
      toast({ title: "Added to wishlist" });
    }
  }

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-surface mb-4">
        <button
          onClick={() => handleGetProductDetails(product?._id)}
          className="block w-full"
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-full object-cover transition-all duration-700 ease-luxury group-hover:scale-105"
            />
          </div>
        </button>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOutOfStock ? (
            <Badge variant="default">Out of Stock</Badge>
          ) : isLowStock ? (
            <Badge variant="limited">Low Stock</Badge>
          ) : hasSale ? (
            <Badge variant="premium">Sale</Badge>
          ) : null}
        </div>

        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-fast hover:bg-white"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-accent text-accent" : "text-espresso"}`} />
        </button>

        {!isOutOfStock && (
          <button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="absolute bottom-0 left-0 right-0 h-12 bg-primary text-primary-foreground text-xs uppercase tracking-[0.12em] font-medium flex items-center justify-center gap-2 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300 ease-luxury"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>

      <div className="space-y-1.5 px-1">
        <h3 className="font-serif text-lg font-medium text-foreground">
          {product?.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasSale ? (
              <>
                <span className="text-lg font-medium text-accent">
                  ${product?.salePrice}
                </span>
                <span className="text-sm text-muted line-through">
                  ${product?.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-medium text-foreground">
                ${product?.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;

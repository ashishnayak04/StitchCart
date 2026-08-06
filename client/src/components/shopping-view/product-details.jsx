import { Heart, ShoppingBag, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Badge } from "../ui/badge";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  useEffect(() => {
    if (productDetails?._id) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setInWishlist(wishlist.includes(productDetails._id));
    }
  }, [productDetails?._id]);

  function handleWishlistToggle() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (inWishlist) {
      const updated = wishlist.filter((id) => id !== productDetails?._id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setInWishlist(false);
      toast({ title: "Removed from wishlist" });
    } else {
      wishlist.push(productDetails?._id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setInWishlist(true);
      toast({ title: "Added to wishlist" });
    }
  }

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  if (!productDetails) return null;

  const hasSale = productDetails?.salePrice > 0;
  const isOutOfStock = productDetails?.totalStock === 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-5xl max-w-[95vw] p-0 max-h-[85vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="aspect-square overflow-hidden bg-surface">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 lg:p-12 flex flex-col">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                {hasSale && (
                  <Badge variant="premium" className="mb-3">Sale</Badge>
                )}
                <h1 className="display-md text-foreground leading-tight">
                  {productDetails?.title}
                </h1>
              </div>
              <button onClick={handleWishlistToggle} className="text-muted hover:text-foreground transition-colors">
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-accent text-accent" : ""}`} />
              </button>
            </div>

            <p className="text-sm text-muted leading-relaxed mb-6">
              {productDetails?.description}
            </p>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-6">
              {hasSale ? (
                <>
                  <span className="text-3xl font-serif font-semibold text-accent">
                    ${productDetails?.salePrice}
                  </span>
                  <span className="text-lg text-muted line-through">
                    ${productDetails?.price}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-serif font-semibold text-foreground">
                  ${productDetails?.price}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-sm text-muted">
                ({averageReview.toFixed(1)})
              </span>
            </div>

            <Separator className="mb-6" />

            {/* Craftsmanship Details */}
            <div className="space-y-3 mb-6">
              {["Premium materials", "Expert craftsmanship", "Free shipping"].map(
                (detail) => (
                  <div key={detail} className="flex items-center gap-3 text-sm text-muted">
                    <Check className="w-4 h-4 text-accent" />
                    {detail}
                  </div>
                )
              )}
            </div>

            {/* Add to Cart */}
            <div className="mt-auto">
              {isOutOfStock ? (
                <Button disabled className="w-full opacity-50">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full uppercase"
                  size="lg"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="heading text-foreground mb-4">Customer Reviews</h3>
              <div className="max-h-[200px] overflow-y-auto space-y-4 mb-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {reviewItem?.userName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {reviewItem?.userName}
                          </span>
                          <div className="flex">
                            <StarRatingComponent
                              rating={reviewItem?.reviewValue}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">No reviews yet</p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <Label>Write a Review</Label>
                <div className="flex">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Share your thoughts..."
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === "" || rating === 0}
                  className="w-full uppercase text-xs"
                  size="sm"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;

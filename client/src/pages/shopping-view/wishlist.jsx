import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ShoppingWishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  function getWishlistIds() {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  }

  function fetchWishlistProducts() {
    const ids = getWishlistIds();
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:9000/api/shop/products/get?ids=${ids.join(",")}`)
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch(() => {
        toast({ title: "Failed to load wishlist", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }

  function handleRemoveFromWishlist(e, productId) {
    e.stopPropagation();
    const wishlist = getWishlistIds();
    const updated = wishlist.filter((id) => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    toast({ title: "Removed from wishlist" });
  }

  useEffect(() => {
    fetchWishlistProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-surface mb-4" />
              <div className="h-4 bg-surface rounded w-3/4 mb-2" />
              <div className="h-4 bg-surface rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="display-md text-foreground">My Wishlist</h1>
        <p className="text-sm text-muted mt-2">
          {products.length} {products.length === 1 ? "item" : "items"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 mx-auto text-taupe/40 mb-4" />
          <h2 className="heading text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted mb-6">
            Save your favorite items here by tapping the heart icon.
          </p>
          <Button onClick={() => navigate("/shop/listing")} size="lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => {
            const hasSale = product?.salePrice > 0;
            return (
              <div
                key={product._id}
                className="group cursor-pointer"
                onClick={() => navigate(`/shop/listing`)}
              >
                <div className="relative overflow-hidden bg-surface mb-4">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product?.image}
                      alt={product?.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-luxury group-hover:scale-105"
                    />
                  </div>
                  <button
                    onClick={(e) => handleRemoveFromWishlist(e, product._id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-danger" />
                  </button>
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
                            ₹{product?.salePrice}
                          </span>
                          <span className="text-sm text-muted line-through">
                            ₹{product?.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-medium text-foreground">
                          ₹{product?.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShoppingWishlist;

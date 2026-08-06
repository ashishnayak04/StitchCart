import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useToast } from "../ui/use-toast";

function ShoppingFooter() {
  const { toast } = useToast();
  return (
    <footer className="bg-espresso text-ivory">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">StitchCart</h3>
            <p className="text-sm text-ivory/60 leading-relaxed">
              Timeless elegance, meticulously crafted. Discover refined fashion for those who appreciate the art of dressing well.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="overline text-gold">Shop</h4>
            <ul className="space-y-3">
              {["Men", "Women", "Kids", "Accessories", "Footwear"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/shop/listing?category=${item.toLowerCase()}`}
                    className="text-sm text-ivory/60 hover:text-ivory transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="overline text-gold">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Press", "Sustainability"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => toast({ title: item, description: `Learn more about ${item.toLowerCase()} — coming soon.` })}
                    className="text-sm text-ivory/60 hover:text-ivory transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="overline text-gold">Support</h4>
            <ul className="space-y-3">
              {["Contact Us", "Shipping & Returns", "FAQ", "Size Guide"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => toast({ title: item, description: `Our ${item.toLowerCase()} page is under development.` })}
                    className="text-sm text-ivory/60 hover:text-ivory transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/40">
            &copy; 2024 StitchCart. All rights reserved.
          </p>
          <p className="text-xs text-ivory/40 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-gold" /> for timeless style
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;

import { Sparkles } from "lucide-react";

function AdminFeatures() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-luxury-cream rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-luxury-gold" />
        </div>
        <h2 className="font-serif text-2xl text-luxury-charcoal">
          Features
        </h2>
        <p className="text-sm text-luxury-taupe">
          Manage additional features and settings
        </p>
      </div>
    </div>
  );
}

export default AdminFeatures;

import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-luxury-ivory">
      <div className="hidden lg:flex flex-col items-center justify-center bg-luxury-charcoal w-1/2 px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-brown/20 to-transparent" />
        <div className="relative z-10 max-w-lg space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="font-serif text-5xl font-bold text-luxury-ivory tracking-tight">
              StitchCart
            </h1>
            <p className="text-lg text-luxury-beige/70 font-light leading-relaxed">
              Timeless elegance, meticulously crafted. Discover a world of refined fashion designed for those who appreciate the art of dressing well.
            </p>
          </div>
          <div className="h-px w-16 bg-luxury-gold mx-auto" />
          <p className="text-sm text-luxury-gold/60 font-medium uppercase tracking-[0.2em]">
            Since 2024
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-luxury-ivory px-6 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

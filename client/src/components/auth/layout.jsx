import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden lg:flex flex-col items-center justify-center bg-espresso w-1/2 px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brown/20 to-transparent" />
        <div className="relative z-10 max-w-lg space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="display-xl text-ivory tracking-tight">
              StitchCart
            </h1>
            <p className="text-lg text-ivory/70 font-light leading-relaxed">
              Timeless elegance, meticulously crafted. Discover a world of refined fashion designed for those who appreciate the art of dressing well.
            </p>
          </div>
          <div className="h-px w-16 bg-gold mx-auto" />
          <p className="overline text-gold/70">Since 2024</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

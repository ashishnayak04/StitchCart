import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Panel: Branding & Visuals */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-zinc-950 w-1/2 px-12 relative overflow-hidden">
        
        {/* Subtle Background Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40" />

        <div className="relative z-10 max-w-md space-y-8 text-center text-white">
          {/* Logo Placeholder */}
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-2xl border border-white/20 shadow-xl">
              <span className="text-3xl">🛒</span>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">StitchCart</span>
            </h1>
            <p className="text-lg text-zinc-400">
              Your one-stop destination for everything you need. Sign in to start shopping today.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication Forms */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        {/* Constraining the width of the Outlet container keeps forms looking neat */}
        <div className="w-full max-w-md shadow-sm border border-slate-100 rounded-2xl p-8 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import InteractiveCatalogDemo from "@/components/landing/InteractiveCatalogDemo";
import InteractiveCheckoutDemo from "@/components/landing/InteractiveCheckoutDemo";
import WorkflowTimeline from "@/components/landing/WorkflowTimeline";
import AdminShowcase from "@/components/landing/AdminShowcase";
import CategoryNav from "@/components/landing/CategoryNav";
import BrandStrip from "@/components/landing/BrandStrip";
import ReviewsSection from "@/components/landing/ReviewsSection";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";

function Landing() {
  return (
    <SmoothScroll>
      <div className="bg-ivory text-espresso min-h-screen flex flex-col selection:bg-accent selection:text-espresso">
        {/* Navigation Header */}
        <LandingHeader />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* 00 - Product Positioning & Live Showcase Hero */}
          <Hero />

          {/* 01 - Problem vs. Solution (Why StitchCart) */}
          <ProblemSolution />

          {/* 02 - Interactive Catalog & Quick-View Playground */}
          <InteractiveCatalogDemo />

          {/* 03 - Live Transparent Checkout & Coupon Engine Demo */}
          <InteractiveCheckoutDemo />

          {/* 04 - End-to-End Commerce Lifecycle & Order Progression */}
          <WorkflowTimeline />

          {/* 05 - Dedicated Operations & Store Management Showcase */}
          <AdminShowcase />

          {/* 06 - 8 Curated Departments Directory */}
          <CategoryNav />

          {/* Heritage Brands Marquee */}
          <BrandStrip />

          {/* 07 - Verified Buyer Community & Platform Metrics */}
          <ReviewsSection />

          {/* 08 - Bank-Grade Security & Consumer Standards */}
          <TrustSection />
        </main>

        {/* Comprehensive Editorial Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default Landing;

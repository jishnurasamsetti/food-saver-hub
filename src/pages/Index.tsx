import { useRef, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FoodSubmissionForm from "@/components/FoodSubmissionForm";
import NGOMap from "@/components/NGOMap";
import DemandPrediction from "@/components/DemandPrediction";
import RecentSubmissions from "@/components/RecentSubmissions";
import { Leaf, Heart, Globe, Sparkles } from "lucide-react";

const Index = () => {
  const submitRef = useRef<HTMLDivElement>(null);
  const ngosRef = useRef<HTMLDivElement>(null);
  const predictRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      submit: submitRef,
      ngos: ngosRef,
      predict: predictRef,
      dashboard: dashboardRef,
    };
    
    refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const refreshDashboard = useCallback(() => {
    // This will trigger a re-render of RecentSubmissions due to realtime subscription
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigate} />
      
      {/* Hero Section */}
      <Hero onGetStarted={() => handleNavigate("submit")} />
      
      {/* Features Strip */}
      <section className="py-12 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold">Reduce Waste</p>
                <p className="text-sm text-muted-foreground">Track & donate surplus</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-display font-semibold">Feed Communities</p>
                <p className="text-sm text-muted-foreground">Connect with NGOs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold">Local Impact</p>
                <p className="text-sm text-muted-foreground">Map nearby partners</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-display font-semibold">AI Predictions</p>
                <p className="text-sm text-muted-foreground">Smart demand forecasts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Food Section */}
      <section ref={submitRef} id="submit" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Submit Surplus Food
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Have leftover food from an event or hotel? Let us help you connect with local NGOs
                who can distribute it to those in need.
              </p>
            </div>
            <FoodSubmissionForm onSuccess={refreshDashboard} />
          </div>
        </div>
      </section>

      {/* NGOs Map Section */}
      <section ref={ngosRef} id="ngos" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Find Nearby NGOs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover partner organizations in your area ready to receive and distribute
              food donations to communities in need.
            </p>
          </div>
          <NGOMap />
        </div>
      </section>

      {/* Predictions Section */}
      <section ref={predictRef} id="predict" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              AI Demand Prediction
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Use our AI-powered tool to predict food demand for your upcoming events
              and reduce waste proactively.
            </p>
          </div>
          <DemandPrediction />
        </div>
      </section>

      {/* Dashboard Section */}
      <section ref={dashboardRef} id="dashboard" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Activity Dashboard
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Track recent food submissions and see the impact our community is making
              in reducing food waste.
            </p>
          </div>
          <RecentSubmissions />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">FoodRescue</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Reducing food waste, one meal at a time. Built for hackathon MVP.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 FoodRescue</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

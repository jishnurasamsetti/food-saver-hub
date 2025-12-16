import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-10" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Food Rescue</span>
          </div>
          
          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Reduce Food Waste,
            <br />
            <span className="text-gradient">Feed Communities</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect hotels and events with local NGOs. Track surplus food, predict demand with AI, 
            and make a real impact on food waste reduction.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              <Leaf className="w-5 h-5" />
              Submit Surplus Food
            </Button>
            <Button variant="hero-outline" size="xl" onClick={() => document.getElementById('ngos')?.scrollIntoView({ behavior: 'smooth' })}>
              Find Nearby NGOs
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">2.5B</p>
              <p className="text-sm text-muted-foreground mt-1">Tons wasted yearly</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-secondary">40%</p>
              <p className="text-sm text-muted-foreground mt-1">From hotels & events</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">828M</p>
              <p className="text-sm text-muted-foreground mt-1">People hungry</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

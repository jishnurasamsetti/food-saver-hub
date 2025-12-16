import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, Building2, Loader2 } from "lucide-react";

interface NGO {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contact_phone: string | null;
  contact_email: string | null;
  description: string | null;
  capacity_kg: number | null;
}

const NGOMap = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const { data, error } = await supabase
        .from("ngos")
        .select("*")
        .order("name");

      if (error) throw error;
      setNgos(data || []);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map placeholder - styled visualization */}
      <div className="lg:col-span-2 relative">
        <Card className="glass-card border-primary/10 overflow-hidden h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-muted/50">
            {/* Map grid lines for visual effect */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-primary/30"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-primary/30"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>
            
            {/* NGO markers */}
            {ngos.map((ngo, index) => (
              <button
                key={ngo.id}
                onClick={() => setSelectedNgo(ngo)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 ${
                  selectedNgo?.id === ngo.id ? "scale-125 z-10" : ""
                }`}
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${25 + (index * 12) % 50}%`,
                }}
              >
                <div className={`p-2 rounded-full ${
                  selectedNgo?.id === ngo.id 
                    ? "bg-secondary shadow-glow" 
                    : "bg-primary shadow-medium"
                }`}>
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    selectedNgo?.id === ngo.id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-card/90 text-foreground"
                  }`}>
                    {ngo.name}
                  </span>
                </div>
              </button>
            ))}
            
            {/* Map center decoration */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 rounded-full border-2 border-primary/20 animate-pulse-soft" />
              <div className="absolute inset-4 rounded-full border border-primary/10" />
            </div>
          </div>
          
          {/* Map attribution */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass-card px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Interactive map showing {ngos.length} partner NGOs
            </div>
          </div>
        </Card>
      </div>

      {/* NGO List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <h3 className="font-display text-lg font-semibold sticky top-0 bg-background py-2">
          Partner NGOs ({ngos.length})
        </h3>
        {ngos.map((ngo) => (
          <Card
            key={ngo.id}
            className={`glass-card cursor-pointer transition-all duration-300 ${
              selectedNgo?.id === ngo.id
                ? "border-primary shadow-medium"
                : "border-border/50 hover:border-primary/50"
            }`}
            onClick={() => setSelectedNgo(ngo)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base font-display">{ngo.name}</CardTitle>
                </div>
                {ngo.capacity_kg && (
                  <Badge variant="secondary" className="text-xs">
                    {ngo.capacity_kg}kg capacity
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">{ngo.address}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {ngo.description && (
                <p className="text-sm text-muted-foreground mb-3">{ngo.description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {ngo.contact_phone && (
                  <a href={`tel:${ngo.contact_phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Phone className="w-3 h-3" />
                    {ngo.contact_phone}
                  </a>
                )}
                {ngo.contact_email && (
                  <a href={`mailto:${ngo.contact_email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Mail className="w-3 h-3" />
                    {ngo.contact_email}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NGOMap;

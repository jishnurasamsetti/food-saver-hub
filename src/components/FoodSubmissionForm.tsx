import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, UtensilsCrossed, MapPin, Scale, Info } from "lucide-react";

const FOOD_TYPES = [
  "Cooked Meals",
  "Fresh Vegetables",
  "Fresh Fruits",
  "Bread & Bakery",
  "Dairy Products",
  "Beverages",
  "Packaged Foods",
  "Mixed Items",
  "Other",
];

const EVENT_TYPES = [
  "Hotel Buffet",
  "Wedding",
  "Corporate Event",
  "Conference",
  "Restaurant",
  "Catering Service",
  "Other",
];

const UNITS = ["kg", "portions", "liters", "items"];

interface FoodSubmissionFormProps {
  onSuccess?: () => void;
}

const FoodSubmissionForm = ({ onSuccess }: FoodSubmissionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    food_type: "",
    quantity: "",
    unit: "kg",
    location: "",
    event_type: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.food_type || !formData.quantity || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("food_submissions").insert({
        food_type: formData.food_type,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        location: formData.location,
        event_type: formData.event_type || null,
        notes: formData.notes || null,
        status: "available",
      });

      if (error) throw error;

      toast.success("Food submission recorded successfully!");
      setFormData({
        food_type: "",
        quantity: "",
        unit: "kg",
        location: "",
        event_type: "",
        notes: "",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting food:", error);
      toast.error("Failed to submit food data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card border-primary/10">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-2xl">Submit Surplus Food</CardTitle>
            <CardDescription>Help us connect your food with those who need it</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Food Type */}
            <div className="space-y-2">
              <Label htmlFor="food_type" className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                Food Type *
              </Label>
              <Select
                value={formData.food_type}
                onValueChange={(value) => setFormData({ ...formData, food_type: value })}
              >
                <SelectTrigger id="food_type">
                  <SelectValue placeholder="Select food type" />
                </SelectTrigger>
                <SelectContent>
                  {FOOD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="event_type" className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                Event Type
              </Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) => setFormData({ ...formData, event_type: value })}
              >
                <SelectTrigger id="event_type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-muted-foreground" />
                Quantity *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="flex-1"
                />
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Location *
              </Label>
              <Input
                id="location"
                placeholder="Enter pickup address"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special handling instructions, best before time, allergen info..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Food Donation"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FoodSubmissionForm;

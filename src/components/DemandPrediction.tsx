import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Brain, TrendingUp, Calendar, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PredictionResult {
  predicted_demand: number;
  confidence: number;
  recommendations: string[];
}

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding", avgAttendees: 200 },
  { value: "corporate", label: "Corporate Event", avgAttendees: 150 },
  { value: "conference", label: "Conference", avgAttendees: 300 },
  { value: "hotel_buffet", label: "Hotel Buffet", avgAttendees: 100 },
  { value: "catering", label: "Catering Service", avgAttendees: 80 },
];

const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const DemandPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    event_type: "",
    expected_attendees: "",
    day_of_week: "",
  });

  const handlePredict = async () => {
    if (!formData.event_type || !formData.expected_attendees || !formData.day_of_week) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const { data, error } = await supabase.functions.invoke("predict-demand", {
        body: {
          event_type: formData.event_type,
          expected_attendees: parseInt(formData.expected_attendees),
          day_of_week: formData.day_of_week,
        },
      });

      if (error) throw error;

      setPrediction(data);
      toast.success("Prediction generated successfully!");
    } catch (error: any) {
      console.error("Prediction error:", error);
      if (error.message?.includes("429") || error.status === 429) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
      } else if (error.message?.includes("402") || error.status === 402) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error("Failed to generate prediction. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card className="glass-card border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Brain className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="font-display text-2xl">AI Demand Predictor</CardTitle>
              <CardDescription>Predict food demand to reduce waste</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type</Label>
            <Select
              value={formData.event_type}
              onValueChange={(value) => setFormData({ ...formData, event_type: value })}
            >
              <SelectTrigger id="event_type">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Expected Attendees</Label>
            <Input
              id="attendees"
              type="number"
              min="1"
              placeholder="Enter number of attendees"
              value={formData.expected_attendees}
              onChange={(e) => setFormData({ ...formData, expected_attendees: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day">Day of Week</Label>
            <Select
              value={formData.day_of_week}
              onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
            >
              <SelectTrigger id="day">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day.toLowerCase()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Prediction
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className={`glass-card border-primary/10 transition-all duration-500 ${
        prediction ? "opacity-100" : "opacity-60"
      }`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display text-2xl">Prediction Results</CardTitle>
              <CardDescription>AI-powered demand forecast</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {prediction ? (
            <div className="space-y-6 animate-fade-in">
              {/* Main prediction */}
              <div className="text-center py-6 bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Predicted Food Demand</p>
                <p className="font-display text-5xl font-bold text-primary">
                  {prediction.predicted_demand}
                  <span className="text-2xl text-muted-foreground ml-2">kg</span>
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {prediction.confidence}% confidence
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-secondary" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Fill in the form and click "Generate Prediction" to see AI-powered demand forecasts</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandPrediction;

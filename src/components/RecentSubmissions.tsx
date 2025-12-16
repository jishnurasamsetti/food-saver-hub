import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MapPin, Scale, Loader2, Leaf } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FoodSubmission {
  id: string;
  food_type: string;
  quantity: number;
  unit: string;
  location: string;
  event_type: string | null;
  status: string | null;
  created_at: string;
}

const RecentSubmissions = () => {
  const [submissions, setSubmissions] = useState<FoodSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();

    // Set up realtime subscription
    const channel = supabase
      .channel("food-submissions-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "food_submissions",
        },
        (payload) => {
          setSubmissions((prev) => [payload.new as FoodSubmission, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("food_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "available":
        return "bg-success/10 text-success border-success/20";
      case "claimed":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "collected":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="glass-card border-primary/10">
        <CardContent className="py-12 text-center">
          <Leaf className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No food submissions yet. Be the first to contribute!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">Recent Submissions</h3>
        <Badge variant="outline" className="text-primary">
          {submissions.length} entries
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission, index) => (
          <Card
            key={submission.id}
            className="glass-card border-primary/10 hover:shadow-medium transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-display">{submission.food_type}</CardTitle>
                <Badge variant="outline" className={getStatusColor(submission.status)}>
                  {submission.status || "pending"}
                </Badge>
              </div>
              {submission.event_type && (
                <CardDescription className="text-xs">{submission.event_type}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  {submission.quantity} {submission.unit}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{submission.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentSubmissions;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_type, expected_attendees, day_of_week } = await req.json();

    console.log("Prediction request:", { event_type, expected_attendees, day_of_week });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an AI assistant specialized in food demand prediction for events. 
Based on historical patterns and the provided parameters, predict the amount of food (in kg) that will be needed.

Consider these factors:
- Event type affects portion sizes and food variety
- Day of week affects attendance patterns (weekends typically have more attendance)
- Historical averages: Weddings ~0.8kg/person, Corporate ~0.5kg/person, Conferences ~0.4kg/person, Buffets ~0.6kg/person

Return a JSON object with:
- predicted_demand: number (total kg of food needed)
- confidence: number (0-100, your confidence in the prediction)
- recommendations: array of 3 actionable recommendations to reduce waste`;

    const userPrompt = `Predict food demand for:
- Event type: ${event_type}
- Expected attendees: ${expected_attendees}
- Day of week: ${day_of_week}

Provide your prediction as JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "food_demand_prediction",
              description: "Return the food demand prediction with recommendations",
              parameters: {
                type: "object",
                properties: {
                  predicted_demand: {
                    type: "number",
                    description: "Total predicted food demand in kg",
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence level 0-100",
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of 3 actionable recommendations",
                  },
                },
                required: ["predicted_demand", "confidence", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "food_demand_prediction" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    // Extract the tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const prediction = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

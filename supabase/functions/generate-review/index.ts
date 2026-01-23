import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneId, phoneName, brand, price, ram, storage, processor, battery, camera, display } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Construct the prompt
    const specs = [
      ram && `RAM: ${ram}`,
      storage && `Storage: ${storage}`,
      processor && `Processor: ${processor}`,
      battery && `Battery: ${battery}`,
      camera && `Camera: ${camera}`,
      display && `Display: ${display}`,
    ].filter(Boolean).join("\n");

    const prompt = `You are a professional tech reviewer writing for a mobile phone comparison website. Write a comprehensive 500-word review for the ${phoneName} by ${brand} priced at $${price}.

Phone Specifications:
${specs}

Your review should:
1. Start with a brief introduction about the phone
2. Discuss key features and their real-world value
3. Analyze value for money compared to competitors
4. Include a "PROS:" section with 3-4 bullet points
5. Include a "CONS:" section with 2-3 bullet points  
6. End with a "FINAL VERDICT:" paragraph summarizing who should buy this phone

Write in a friendly, professional tone. Be specific about the specs and their benefits. Focus on helping buyers make informed decisions.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert mobile phone reviewer with deep knowledge of smartphone technology, market trends, and consumer needs." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const review = aiResponse.choices?.[0]?.message?.content;

    if (!review) {
      throw new Error("No review generated");
    }

    // Save the review to the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from("phones")
      .update({ ai_verdict: review })
      .eq("id", phoneId);

    if (updateError) {
      console.error("Error updating phone:", updateError);
      throw new Error("Failed to save review");
    }

    return new Response(JSON.stringify({ success: true, review }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-review error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

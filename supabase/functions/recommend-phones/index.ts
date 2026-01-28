import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { budget, preferences } = await req.json();
    
    if (!budget) {
      return new Response(
        JSON.stringify({ error: 'Budget is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Fetch phones from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get phones within budget range (±20%)
    const minBudget = budget * 0.8;
    const maxBudget = budget * 1.2;

    const { data: phones, error: fetchError } = await supabase
      .from('phones')
      .select('*')
      .gte('current_price', minBudget)
      .lte('current_price', maxBudget)
      .limit(20);

    if (fetchError) {
      throw new Error('Failed to fetch phones');
    }

    if (!phones || phones.length === 0) {
      return new Response(
        JSON.stringify({ 
          recommendations: [],
          message: 'No phones found in your budget range'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a summary of available phones for AI
    const phoneSummaries = phones.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.current_price,
      processor: p.processor,
      ram: p.ram,
      storage: p.storage,
      battery: p.battery,
      camera: p.main_camera,
      display: p.display_size,
      rating: p.rating
    }));

    const preferencesText = preferences && preferences.length > 0 
      ? `User preferences: ${preferences.join(', ')}`
      : 'User has no specific preferences';

    const prompt = `You are a phone recommendation expert. Given the user's budget of Rs. ${budget} and the following available phones, recommend the top 5 best options.

${preferencesText}

Available phones:
${JSON.stringify(phoneSummaries, null, 2)}

Analyze each phone and return a JSON response with exactly this structure:
{
  "recommendations": [
    {
      "phone_id": "uuid of the phone",
      "rank": 1,
      "matchScore": 95,
      "reason": "Brief 1-2 sentence explanation why this phone is recommended",
      "bestFor": ["gaming", "photography", "daily use"]
    }
  ],
  "summary": "A brief 2-3 sentence summary of the recommendations based on the user's budget and preferences"
}

Consider factors like value for money, specifications quality, and user preferences. Return ONLY valid JSON.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a professional phone recommendation assistant. Always provide honest, helpful recommendations based on specs and value. Respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    let result;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Enrich recommendations with full phone data
    const enrichedRecommendations = result.recommendations.map((rec: any) => {
      const phone = phones.find(p => p.id === rec.phone_id);
      return {
        ...rec,
        phone: phone || null
      };
    }).filter((rec: any) => rec.phone !== null);

    return new Response(
      JSON.stringify({ 
        recommendations: enrichedRecommendations,
        summary: result.summary 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate recommendations';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

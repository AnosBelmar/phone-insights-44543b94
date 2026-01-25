import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();
    
    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const phoneSpecs = `
Phone: ${phone.name}
Price: Rs. ${phone.current_price}${phone.original_price ? ` (Original: Rs. ${phone.original_price})` : ''}
${phone.discount ? `Discount: ${phone.discount}` : ''}
Rating: ${phone.rating || 'N/A'}
Processor: ${phone.processor || 'Unknown'}
RAM: ${phone.ram || 'Unknown'}
Storage: ${phone.storage || 'Unknown'}
Battery: ${phone.battery || 'Unknown'}
Main Camera: ${phone.main_camera || 'Unknown'}
Selfie Camera: ${phone.selfie_camera || 'Unknown'}
Display Size: ${phone.display_size || 'Unknown'}
Display Type: ${phone.display_type || 'Unknown'}
OS: ${phone.os || 'Unknown'}
Network: ${phone.network || 'Unknown'}
Weight: ${phone.weight || 'Unknown'}
Dimensions: ${phone.dimensions || 'Unknown'}
    `.trim();

    const prompt = `You are an expert tech reviewer. Based on the following phone specifications, generate a comprehensive review in JSON format.

${phoneSpecs}

Generate a response with exactly this JSON structure:
{
  "summary": "A 2-3 sentence compelling summary of the phone highlighting its best features and value proposition",
  "pros": ["pro 1", "pro 2", "pro 3", "pro 4", "pro 5"],
  "cons": ["con 1", "con 2", "con 3"],
  "verdict": "A 2-3 sentence final verdict on whether this phone is worth buying and who it's best for",
  "performanceScore": 85,
  "cameraScore": 80,
  "batteryScore": 82,
  "valueScore": 88,
  "displayScore": 83,
  "highlights": [
    {"title": "Performance", "description": "Brief description of performance"},
    {"title": "Camera", "description": "Brief description of camera quality"},
    {"title": "Battery", "description": "Brief description of battery life"},
    {"title": "Display", "description": "Brief description of display quality"}
  ],
  "bestFor": ["gaming", "photography", "daily use"],
  "comparison": "Brief comparison with similar phones in this price range"
}

Be honest and realistic. Scores should be out of 100. Consider the price point when evaluating value. Return ONLY valid JSON, no markdown or extra text.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional tech reviewer who provides honest, detailed smartphone reviews. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GROQ API error:', response.status, errorText);
      throw new Error(`GROQ API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in GROQ response');
    }

    // Parse the JSON response
    let review;
    try {
      // Remove any potential markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      review = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse GROQ response:', content);
      throw new Error('Invalid JSON response from GROQ');
    }

    return new Response(
      JSON.stringify({ review }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating review:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate review';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

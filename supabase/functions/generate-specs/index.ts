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
    const { phoneName, phoneId } = await req.json();
    
    if (!phoneName || !phoneId) {
      return new Response(
        JSON.stringify({ error: 'Phone name and ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `You are a mobile phone specifications expert. For the phone "${phoneName}", provide accurate and detailed specifications.

Return ONLY valid JSON with this exact structure (use realistic values based on actual phone specs):
{
  "processor": "e.g., Snapdragon 8 Gen 3 or MediaTek Dimensity 9300",
  "ram": "e.g., 8GB or 12GB",
  "storage": "e.g., 128GB or 256GB",
  "battery": "e.g., 5000mAh",
  "main_camera": "e.g., 108MP + 12MP Ultra Wide + 5MP Macro",
  "selfie_camera": "e.g., 32MP",
  "display_size": "e.g., 6.7 inches",
  "display_type": "e.g., AMOLED 120Hz",
  "os": "e.g., Android 14 or iOS 17",
  "network": "e.g., 5G, 4G LTE",
  "weight": "e.g., 195g",
  "dimensions": "e.g., 163.3 x 77.9 x 8.9mm"
}

Be accurate based on the actual phone model. If unsure, provide reasonable estimates based on similar phones in that price range/brand. Return ONLY valid JSON.`;

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
            content: 'You are a mobile phone specifications database. Always respond with accurate, valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
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

    // Parse the JSON response
    let specs;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      specs = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Update the phone in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from('phones')
      .update({
        processor: specs.processor,
        ram: specs.ram,
        storage: specs.storage,
        battery: specs.battery,
        main_camera: specs.main_camera,
        selfie_camera: specs.selfie_camera,
        display_size: specs.display_size,
        display_type: specs.display_type,
        os: specs.os,
        network: specs.network,
        weight: specs.weight,
        dimensions: specs.dimensions,
      })
      .eq('id', phoneId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update phone specs in database');
    }

    return new Response(
      JSON.stringify({ specs, updated: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating specs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate specs';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

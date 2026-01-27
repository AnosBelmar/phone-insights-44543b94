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

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
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
  "dimensions": "e.g., 163.3 x 77.9 x 8.9mm",
  "screen_resolution": "e.g., 1440 x 3200 pixels",
  "screen_protection": "e.g., Gorilla Glass Victus 2",
  "sim_support": "e.g., Dual SIM (Nano-SIM)",
  "release_date": "e.g., March 2024",
  "gpu": "e.g., Adreno 750",
  "card_slot": "e.g., Yes, microSD up to 1TB or No",
  "bluetooth": "e.g., 5.3",
  "wifi": "e.g., Wi-Fi 6E",
  "nfc": "e.g., Yes or No",
  "usb": "e.g., USB Type-C 3.2",
  "fast_charging": "e.g., 65W",
  "wireless_charging": "e.g., 15W or No",
  "front_flash": "e.g., Yes or No",
  "back_flash": "e.g., LED flash",
  "video_recording": "e.g., 4K@60fps, 8K@24fps"
}

Be accurate based on the actual phone model. If unsure, provide reasonable estimates based on similar phones in that price range/brand. Return ONLY valid JSON.`;

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
            content: 'You are a mobile phone specifications database. Always respond with accurate, valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
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
    let specs;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      specs = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse GROQ response:', content);
      throw new Error('Invalid JSON response from GROQ');
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

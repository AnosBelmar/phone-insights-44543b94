import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PhoneReview {
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
  performanceScore: number;
  cameraScore: number;
  batteryScore: number;
  valueScore: number;
  displayScore: number;
  highlights: Array<{ title: string; description: string }>;
  bestFor: string[];
  comparison: string;
}

interface PhoneData {
  name: string;
  current_price: number;
  original_price?: number | null;
  discount?: string | null;
  rating?: number | null;
  processor?: string | null;
  ram?: string | null;
  storage?: string | null;
  battery?: string | null;
  main_camera?: string | null;
  selfie_camera?: string | null;
  display_size?: string | null;
  display_type?: string | null;
  os?: string | null;
  network?: string | null;
  weight?: string | null;
  dimensions?: string | null;
}

export const usePhoneReview = (phone: PhoneData | null | undefined) => {
  return useQuery({
    queryKey: ["phone-review", phone?.name],
    queryFn: async (): Promise<PhoneReview> => {
      const { data, error } = await supabase.functions.invoke("generate-review", {
        body: { phone },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate review");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data.review;
    },
    enabled: !!phone?.name,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1,
  });
};

import { useState, useEffect } from "react";

interface CurrencyInfo {
  symbol: string;
  code: string;
  rate: number;
  isLoading: boolean;
}

const PKR_TO_USD_RATE = 280;

export const useCurrency = (): CurrencyInfo => {
  const [isPakistan, setIsPakistan] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Use a free IP geolocation API
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setIsPakistan(data.country_code === "PK");
      } catch (error) {
        // Default to Pakistan if detection fails
        console.warn("Country detection failed, defaulting to PKR:", error);
        setIsPakistan(true);
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  // Default to PKR while loading
  if (isLoading || isPakistan === null) {
    return {
      symbol: "Rs",
      code: "PKR",
      rate: 1,
      isLoading: true,
    };
  }

  if (isPakistan) {
    return {
      symbol: "Rs",
      code: "PKR",
      rate: 1,
      isLoading: false,
    };
  }

  return {
    symbol: "$",
    code: "USD",
    rate: PKR_TO_USD_RATE,
    isLoading: false,
  };
};

export const formatPrice = (
  pricePKR: number,
  symbol: string,
  rate: number
): string => {
  const convertedPrice = pricePKR / rate;
  
  if (rate === 1) {
    // PKR formatting
    return `${symbol} ${convertedPrice.toLocaleString("en-PK")}`;
  }
  
  // USD formatting
  return `${symbol}${convertedPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

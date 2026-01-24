import { Link } from "react-router-dom";
import { 
  Smartphone, Battery, Camera, Cpu, Monitor, 
  Layers, HardDrive, Shield, Zap, Weight 
} from "lucide-react";
import { useCurrency, formatPrice } from "@/hooks/useCurrency";

interface PhoneCardProps {
  name: string;
  slug: string;
  currentPrice: number;
  originalPrice?: number | null;
  discount?: string | null;
  imageUrl?: string | null;
  
  // High-Level Specs
  processor?: string | null;
  os?: string | null;
  display_type?: string | null;
  display_size?: string | null;
  display_res?: string | null;
  main_camera?: string | null;
  selfie_camera?: string | null;
  battery?: string | null;
  charging?: string | null;
  storage?: string | null;
  ram?: string | null;
  weight?: string | null;
  sensors?: string | null;
  connectivity?: string | null;
}

const PhoneCard = (phone: PhoneCardProps) => {
  const { symbol, rate } = useCurrency();

  return (
    <Link to={`/phone/${phone.slug}`} className="block h-full group">
      <article className="card-premium h-full flex flex-col bg-[#0A0A0A] border border-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden shadow-2xl">
        
        {/* Image Section */}
        <div className="aspect-[4/3] bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-8 relative">
          {phone.imageUrl ? (
            <img
              src={phone.imageUrl}
              alt={phone.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <Smartphone className="w-16 h-16 opacity-10" />
          )}

          {/* Premium Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {phone.discount && (
              <span className="text-[10px] font-black bg-primary text-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                -{phone.discount}
              </span>
            )}
            <span className="text-[10px] font-bold bg-white/10 backdrop-blur-md text-white/60 px-2 py-0.5 rounded-sm border border-white/10 uppercase">
              {phone.storage}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
              {phone.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-primary">
                {formatPrice(phone.currentPrice, symbol, rate)}
              </span>
              {phone.originalPrice && (
                <span className="text-xs text-white/30 line-through">
                  {formatPrice(phone.originalPrice, symbol, rate)}
                </span>
              )}
            </div>
          </div>

          {/* --- The "Attentive" Technical Datasheet --- */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            
            {/* Main Spec Icons (The Big 4) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded">
                  <Monitor className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase font-bold">Display</span>
                  <span className="text-[11px] text-white font-medium truncate">{phone.display_size}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/10 rounded">
                  <Battery className="w-3.5 h-3.5 text-green-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase font-bold">Battery</span>
                  <span className="text-[11px] text-white font-medium truncate">{phone.battery}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/10 rounded">
                  <Camera className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase font-bold">Camera</span>
                  <span className="text-[11px] text-white font-medium truncate">{phone.main_camera}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-500/10 rounded">
                  <Cpu className="w-3.5 h-3.5 text-yellow-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase font-bold">Chipset</span>
                  <span className="text-[11px] text-white font-medium truncate">{phone.processor}</span>
                </div>
              </div>
            </div>

            {/* Detailed Spec List (The Rest) */}
            <div className="space-y-1.5 bg-white/[0.02] p-3 rounded-lg border border-white/5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40 flex items-center gap-1"><Zap className="w-3 h-3"/> Charging</span>
                <span className="text-white/80 font-mono">{phone.charging || 'Standard'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40 flex items-center gap-1"><Layers className="w-3 h-3"/> OS</span>
                <span className="text-white/80 font-mono">{phone.os || 'Android'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40 flex items-center gap-1"><HardDrive className="w-3 h-3"/> RAM</span>
                <span className="text-white/80 font-mono">{phone.ram}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40 flex items-center gap-1"><Weight className="w-3 h-3"/> Weight</span>
                <span className="text-white/80 font-mono">{phone.weight || '190g'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40 flex items-center gap-1"><Shield className="w-3 h-3"/> Sensors</span>
                <span className="text-white/80 font-mono truncate max-w-[100px]">{phone.sensors || 'Standard'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 flex justify-between items-center group/btn">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover/btn:translate-x-1 transition-transform">
               View Full Specs →
             </span>
             <span className="text-[10px] text-white/20 font-mono">#{phone.slug}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PhoneCard;

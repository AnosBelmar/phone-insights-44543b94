import { 
  Cpu, HardDrive, Battery, Camera, Monitor, Layers, 
  Wifi, Scale, Ruler, Calendar, Smartphone, Settings,
  Bluetooth, Radio, Usb, Zap
} from "lucide-react";

interface Phone {
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

interface SpecificationsSectionProps {
  phone: Phone;
}

const SpecGroup = ({ 
  title, 
  specs 
}: { 
  title: string; 
  specs: Array<{ label: string; value: string | null | undefined; icon?: React.ElementType }> 
}) => {
  const hasValues = specs.some(s => s.value);
  if (!hasValues) return null;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="bg-secondary/30 px-5 py-3 border-b border-border">
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border/50">
        {specs.map((spec, index) => (
          <div key={index} className="flex justify-between items-center px-5 py-3">
            <span className="text-muted-foreground text-sm">{spec.label}</span>
            <span className="text-foreground font-medium text-sm text-right max-w-[60%]">
              {spec.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HighlightCard = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | null | undefined 
}) => {
  if (!value) return null;
  
  return (
    <div className="flex flex-col items-center text-center p-4 bg-card rounded-xl border border-border">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="text-foreground font-bold text-sm">{value}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
};

export const SpecificationsSection = ({ phone }: SpecificationsSectionProps) => {
  const hasSpecs = phone.processor || phone.ram || phone.storage || phone.battery || 
                   phone.main_camera || phone.display_size || phone.os;

  if (!hasSpecs) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center">
        <Smartphone className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
        <p className="text-muted-foreground">
          Detailed specifications are not available for this phone yet.
        </p>
        <p className="text-sm text-muted-foreground/70 mt-2">
          Check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <HighlightCard icon={Monitor} label="Display" value={phone.display_size} />
        <HighlightCard icon={HardDrive} label="RAM" value={phone.ram} />
        <HighlightCard icon={Battery} label="Battery" value={phone.battery} />
        <HighlightCard icon={Camera} label="Back Camera" value={phone.main_camera?.split('+')[0]?.trim()} />
      </div>

      {/* Detailed Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpecGroup 
          title="Display" 
          specs={[
            { label: "Screen Size", value: phone.display_size },
            { label: "Screen Type", value: phone.display_type },
          ]}
        />

        <SpecGroup 
          title="Memory" 
          specs={[
            { label: "RAM", value: phone.ram },
            { label: "Internal Storage", value: phone.storage },
          ]}
        />

        <SpecGroup 
          title="Performance" 
          specs={[
            { label: "Processor", value: phone.processor },
            { label: "Operating System", value: phone.os },
          ]}
        />

        <SpecGroup 
          title="Battery" 
          specs={[
            { label: "Capacity", value: phone.battery },
          ]}
        />

        <SpecGroup 
          title="Camera" 
          specs={[
            { label: "Back Camera", value: phone.main_camera },
            { label: "Front Camera", value: phone.selfie_camera },
          ]}
        />

        <SpecGroup 
          title="Connectivity" 
          specs={[
            { label: "Network", value: phone.network },
          ]}
        />

        <SpecGroup 
          title="General" 
          specs={[
            { label: "Weight", value: phone.weight },
            { label: "Dimensions", value: phone.dimensions },
          ]}
        />
      </div>
    </div>
  );
};

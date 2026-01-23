interface SpecsTableProps {
  specs: {
    label: string;
    value: string | null | undefined;
  }[];
}

const SpecsTable = ({ specs }: SpecsTableProps) => {
  const filteredSpecs = specs.filter(spec => spec.value);

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">
        Specifications
      </h3>
      <div className="divide-y divide-border/50">
        {filteredSpecs.map((spec, index) => (
          <div key={index} className="spec-row">
            <span className="text-muted-foreground">{spec.label}</span>
            <span className="text-foreground font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecsTable;

interface BrandFilterProps {
  brands: string[];
  selectedBrand: string | null;
  onSelect: (brand: string | null) => void;
}

const BrandFilter = ({ brands, selectedBrand, onSelect }: BrandFilterProps) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4">
      <div className="flex gap-3 min-w-max px-4 md:px-0 md:justify-center">
        <button
          onClick={() => onSelect(null)}
          className={`brand-chip ${selectedBrand === null ? 'active' : ''}`}
        >
          All Brands
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onSelect(brand)}
            className={`brand-chip ${selectedBrand === brand ? 'active' : ''}`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;

export const PhoneSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse">
          <div className="aspect-square mb-4 bg-secondary/50 rounded-lg" />
          <div className="h-4 bg-secondary/50 rounded w-3/4 mb-2" />
          <div className="h-4 bg-secondary/50 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};

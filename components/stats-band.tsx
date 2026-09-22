const STATS = [
  { value: "2017", label: "Crafting since" },
  { value: "12,000+", label: "Bracelets delivered" },
  { value: "4.8/5", label: "Average rating" },
  { value: "100%", label: "Natural gemstones" },
];

/** Compact credibility band used between editorial sections. */
export function StatsBand() {
  return (
    <section className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 py-10 text-white sm:py-12">
      <div className="container mx-auto px-4">
        <dl className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-3xl font-bold tracking-tight sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs font-medium uppercase tracking-[0.18em] text-purple-100 sm:text-sm sm:tracking-[0.12em]">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

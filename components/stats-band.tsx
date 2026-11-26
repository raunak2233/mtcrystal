import { readContent } from "@/lib/server/store";

/** Compact credibility band used between editorial sections. */
export async function StatsBand() {
  const content = await readContent();
  const stats = [1, 2, 3, 4].map((index) => ({
    value: content[`shared.stats.${index}.value`] ?? "",
    label: content[`shared.stats.${index}.label`] ?? "",
  }));

  return (
    <section className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 py-10 text-white sm:py-12">
      <div className="container mx-auto px-4">
        <dl className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {stats.map((stat) => (
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

import { ListingCard } from "@/components/shared/ListingCard";

export default function Home() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Banner */}
      <section className="bg-loop-100 dark:bg-loop-800 rounded-xl p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[180px]">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-loop-900 dark:text-loop-100 mb-6">
          Construction season — 400+ timber listings near you
        </h1>
        <button className="bg-loop-600 text-white px-8 py-3 rounded-full font-bold hover:bg-loop-700 transition">
          Browse Timber
        </button>
      </section>

      {/* Free near you */}
      <section>
        <h2 className="font-heading font-bold text-2xl mb-4">Free near you</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ListingCard 
              key={i}
              id={`mock-${i}`}
              title="Pallets - Good condition"
              category="Packaging"
              quantity="20 units"
              priceTag="FREE"
              distance="2.4 km"
              heroImageUrl=""
              expiresAt={new Date(Date.now() + 86400000).toISOString()}
              isVerifiedSeller={i % 2 === 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

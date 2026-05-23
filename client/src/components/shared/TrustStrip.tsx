/**
 * Charcoal-bg trust strip with quick stats. Used on Home and CityPage.
 */
const ITEMS = [
  { value: "60+", label: "Homes “Revived”" },
  { value: "A+", label: "BBB Rating" },
  { value: "4.9★", label: "Google Reviews" },
  { value: "$16M+", label: "Paid to Sellers" },
  { value: "3 Days", label: "Fastest Close" },
];

export default function TrustStrip() {
  return (
    <section className="bg-[#3D4145] py-6">
      <div className="container">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span
                className="text-white font-semibold leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem" }}
              >
                {item.value}
              </span>
              <span className="text-white/50 text-xs tracking-widest uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

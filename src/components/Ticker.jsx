const modules = [
  'M01 Crop Advisor', 'M02 Mandi Prices', 'M03 Flood Warning', 'M04 Livestock Risk',
  'M05 PCOS Detection', 'M06 Maternal Risk', 'M07 Cancer Screening', 'M08 Women\'s Safety',
  'M09 Water Safety', 'M10 Urban Scarcity', 'M11 River Pollution', 'M12 Heatwave Risk',
  'M13 AQI Hospital Surge', 'M14 TB Mapper', 'M15 Child Malnutrition', 'M16 Mental Health',
  'M17 Financial Stress', 'M18 Farmer Loan', 'M19 Road Hotspot', 'M20 PHC Stock-Out',
];

export default function Ticker() {
  const items = [...modules, ...modules];
  return (
    <div className="overflow-hidden bg-[#040f1f] border-y border-[rgba(45,212,191,0.08)] py-3.5">
      <div className="ticker-track">
        {items.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 px-8">
            <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0"/>
            <span className="font-mono text-[0.68rem] tracking-widest text-slate-500 uppercase">{m}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

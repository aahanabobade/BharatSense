import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const domains = [
  {
    id: 'agri',
    tag: 'Agriculture & Rural',
    title: 'When to sow, irrigate, sell — predicted, not guessed.',
    desc: '600 million Indians depend on agriculture. Yet decisions about irrigation, harvest and sale are still made by looking at the sky. M01–M04 replace guesswork with data-driven predictions delivered via SMS to any phone.',
    modules: ['M01 Crop & Soil Advisor', 'M02 Mandi Price Predictor', 'M03 Flood & Drought Warning', 'M04 Livestock Disease Risk'],
    stat: '600M', statLabel: 'People on agriculture',
    color: '#34d399',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    visual: '🌾',
  },
  {
    id: 'women',
    tag: "Women's Health & Safety",
    title: 'Detecting what the system consistently misses.',
    desc: 'NFHS-5 shows 57% of women are anaemic. Maternal mortality is 113 per 100,000. Cervical cancer kills 77,000 women a year — almost entirely preventable. M05–M08 catch risk years before current clinical pathways would.',
    modules: ['M05 Menstrual & PCOS Risk', 'M06 Maternal & Infant Risk', 'M07 Cancer Screening Stratifier', "M08 GBV Hotspot Predictor"],
    stat: '77K', statLabel: 'Preventable deaths/year',
    color: '#f472b6',
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
    bg: 'bg-pink-500/5',
    visual: '🩺',
  },
  {
    id: 'water',
    tag: 'Water & Environment',
    title: '600 million facing water stress — with zero advance warning.',
    desc: 'India\'s most underestimated crisis. 200,000 die annually from contaminated water. Chennai ran out in 2019. Wet-bulb temperature makes outdoor work life-threatening. M09–M12 provide the advance warning that doesn\'t exist.',
    modules: ['M09 Drinking Water Safety', 'M10 Urban Water Scarcity', 'M11 River Pollution Alert', 'M12 Heatwave & Wet-Bulb Risk'],
    stat: '200K', statLabel: 'Water-related deaths/yr',
    color: '#60a5fa',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    visual: '💧',
  },
  {
    id: 'health',
    tag: 'Urban Health & Air',
    title: 'India\'s cities have crises that are invisible until they\'re acute.',
    desc: '14 of the world\'s 15 most polluted cities are in India. TB kills 500 Indians every day. 1 in 3 children under 5 is stunted. 150 million need mental health care and get none. M13–M16 provide the intelligence layer.',
    modules: ['M13 AQI Hospital Surge', 'M14 TB & Lung Disease Mapper', 'M15 Child Malnutrition Flag', 'M16 Mental Health Distress'],
    stat: '500', statLabel: 'TB deaths every day',
    color: '#fbbf24',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    visual: '🏥',
  },
  {
    id: 'finance',
    tag: 'Financial Wellbeing',
    title: 'Debt spirals have a signature. UPI data shows it 3 weeks early.',
    desc: 'The average Indian household has financial savings of Rs 3,500. Over 80% of farmer debt is from moneylenders at 24–60% interest. 13 billion UPI transactions a month contain the clearest early signal of household distress ever seen.',
    modules: ['M17 Household Financial Stress', 'M18 Farmer Loan Distress'],
    stat: '₹3,500', statLabel: 'Average household savings',
    color: '#2dd4bf',
    accent: 'text-teal-400',
    border: 'border-teal-500/20',
    bg: 'bg-teal-500/5',
    visual: '📊',
  },
  {
    id: 'infra',
    tag: 'Infrastructure & Safety',
    title: '80% of road deaths. 5% of locations. Predictable by the hour.',
    desc: 'India loses 1.5 lakh people to road accidents every year — one death every 3.5 minutes. Rural PHCs run out of ORS during diarrhoea season, every year, predictably. M19 and M20 solve problems that have no technical excuse.',
    modules: ['M19 Road Accident Hotspot', 'M20 PHC Medicine Stock-Out'],
    stat: '1.5L', statLabel: 'Road deaths annually',
    color: '#a78bfa',
    accent: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/5',
    visual: '🚦',
  },
];

export default function Domains() {
  const [active, setActive] = useState(0);
  const dom = domains[active];

  return (
    <section id="domains" className="py-28 bg-[#020b18]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-teal-400"/>
            <span className="font-mono text-xs tracking-widest text-teal-400 uppercase">Six Domains</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] text-white leading-[0.95] tracking-tight"
          >
            Every module maps<br />to a <em className="gradient-text not-italic">real crisis.</em>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-px bg-[rgba(45,212,191,0.04)]">
          {/* Domain tabs */}
          <div className="bg-[#020b18] flex flex-col">
            {domains.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActive(i)}
                className={`text-left px-6 py-5 border-b border-[rgba(45,212,191,0.06)] transition-all duration-300 group ${
                  active === i
                    ? 'bg-[rgba(45,212,191,0.04)] border-l-2'
                    : 'hover:bg-[rgba(45,212,191,0.02)]'
                }`}
                style={{
                  borderLeftColor: active === i ? d.color : 'transparent',
                  cursor: 'none',
                }}
              >
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-1.5"
                  style={{ color: active === i ? d.color : '#475569' }}>
                  {d.tag}
                </div>
                <div className={`text-sm font-body transition-colors ${active === i ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {d.modules.length} module{d.modules.length > 1 ? 's' : ''}
                </div>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#040f1f] p-10 lg:p-14 flex flex-col justify-between gap-10"
            >
              <div>
                <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-6"
                  style={{ color: dom.color }}>
                  {dom.tag}
                </div>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.8rem)] text-white leading-tight mb-6">
                  {dom.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light max-w-[60ch]">
                  {dom.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stat */}
                <div className={`${dom.bg} border ${dom.border} p-6`}>
                  <div className={`font-display text-4xl mb-2 ${dom.accent}`}>{dom.stat}</div>
                  <div className="text-slate-400 text-xs font-mono tracking-widest uppercase">{dom.statLabel}</div>
                </div>

                {/* Module list */}
                <div className="border border-[rgba(45,212,191,0.08)] p-6">
                  <div className="text-slate-500 text-[0.6rem] font-mono tracking-widest uppercase mb-3">Modules</div>
                  <ul className="space-y-2">
                    {dom.modules.map((m, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: dom.color }}/>
                        {m.startsWith('M02') ? (
                            <Link
                              to="/modules/m02"
                              className="text-[0.75rem] font-mono hover:underline"
                              style={{ color: dom.color }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {m} ↗
                            </Link>
                          ) : (
                            <span className="text-slate-300 text-[0.75rem] font-mono">{m}</span>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

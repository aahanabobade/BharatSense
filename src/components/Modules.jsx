import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const domains = ['All', 'Agriculture', 'Women', 'Water', 'Health', 'Finance', 'Infrastructure'];

const domainColors = {
  Agriculture:    { bg: 'bg-emerald-500/10', text: 'text-emerald-400',  border: 'border-emerald-500/20' },
  Women:          { bg: 'bg-pink-500/10',    text: 'text-pink-400',     border: 'border-pink-500/20' },
  Water:          { bg: 'bg-blue-500/10',    text: 'text-blue-400',     border: 'border-blue-500/20' },
  Health:         { bg: 'bg-amber-500/10',   text: 'text-amber-400',    border: 'border-amber-500/20' },
  Finance:        { bg: 'bg-teal-500/10',    text: 'text-teal-400',     border: 'border-teal-500/20' },
  Infrastructure: { bg: 'bg-violet-500/10',  text: 'text-violet-400',   border: 'border-violet-500/20' },
};

const modules = [
  { id: 'M01', name: 'Crop & Soil Advisor',         domain: 'Agriculture',    route: '/modules/m01', desc: 'Predicts irrigation need 72 hours ahead. Prevents 30–40% water wastage on small farms across India.',               model: 'Random Forest + XGBoost',   impact: '600M farmers' },
  { id: 'M02', name: 'Mandi Price Predictor',        domain: 'Agriculture',    route:'/modules/m02',           desc: '14-day price forecast for 3,000 mandis. Eliminates information asymmetry between farmers and traders.',            model: 'LSTM Time-Series',           impact: '₹15K–25K/season saved' },
  { id: 'M03', name: 'Flood & Drought Warning',      domain: 'Agriculture',    route: null,           desc: 'Village-level 48-hour flood risk scoring. Drought onset detected weeks before crop point-of-no-return.',          model: 'Gradient Boosting',          impact: 'Block-level granularity' },
  { id: 'M04', name: 'Livestock Disease Risk',       domain: 'Agriculture',    route: null,           desc: 'Spatial FMD and Lumpy Skin Disease outbreak probability by block. Pre-position vaccines before herds collapse.',   model: 'XGBoost + GeoFeatures',     impact: '193M cattle protected' },
  { id: 'M05', name: 'Menstrual & PCOS Risk',        domain: 'Women',          route: null,           desc: 'Detects PCOS markers 2–3 years before typical diagnosis. On-device processing. Private by design.',               model: 'Logistic Regression + SHAP', impact: '1 in 5 women affected' },
  { id: 'M06', name: 'Maternal & Infant Risk',       domain: 'Women',          route: null,           desc: "Predicts high-risk pregnancies at every ANC visit. Targets India's 113 per 100,000 maternal deaths.",             model: 'XGBoost + HMIS Data',        impact: '113/100K mortality rate' },
  { id: 'M07', name: 'Cancer Screening Stratifier',  domain: 'Women',          route: null,           desc: 'Ranks women by cervical cancer risk for limited PHC screening slots. No lab tests required.',                     model: 'Rule-Based + ML Hybrid',     impact: '77K deaths/yr preventable' },
  { id: 'M08', name: 'GBV Hotspot Predictor',        domain: 'Women',          route: null,           desc: 'Hourly spatial-temporal risk scoring by ward. Proactive police deployment. Safer route API for citizens.',        model: 'LightGBM + GeoPandas',       impact: '86 reported rapes/day' },
  { id: 'M09', name: 'Drinking Water Safety',        domain: 'Water',          route: null,           desc: 'Predicts fluoride, arsenic and nitrate spikes 30 days ahead. Monthly alert to Gram Panchayat.',                  model: 'XGBoost + CGWB Data',        impact: '60% districts contaminated' },
  { id: 'M10', name: 'Urban Water Scarcity',         domain: 'Water',          route: null,           desc: '2–3 week ward-level dry prediction for Chennai, Bengaluru, Hyderabad. Ends the annual panic cycle.',             model: 'LSTM + Reservoir Data',      impact: 'Chennai 2019 · Bengaluru 2024' },
  { id: 'M11', name: 'River Pollution Alert',        domain: 'Water',          route: null,           desc: 'Detects industrial discharge anomalies 6–12 hours before they reach drinking water intake points.',              model: 'Isolation Forest',           impact: '275 polluted stretches' },
  { id: 'M12', name: 'Heatwave & Wet-Bulb Risk',     domain: 'Water',          route: null,           desc: '48hr alert when wet-bulb exceeds 32°C — the threshold where human cooling fails. Workers and elderly.',          model: 'XGBoost + Open-Meteo',       impact: '2,000+ heat deaths/year' },
  { id: 'M13', name: 'AQI Hospital Surge',           domain: 'Health',         route: null,           desc: 'Predicts 280%+ ER spike 48 hours before Delhi smog. Pre-positions medicines and calls in extra doctors.',        model: 'XGBoost + OpenAQ',           impact: '3–4x ER volumes on bad days' },
  { id: 'M14', name: 'TB & Lung Disease Mapper',     domain: 'Health',         route: null,           desc: 'Ward-level TB cluster prediction from NIKSHAY + AQI history. India carries 28% of the global burden.',          model: 'LightGBM + Spatial',         impact: '2.8M cases annually' },
  { id: 'M15', name: 'Child Malnutrition Flag',      domain: 'Health',         route: null,           desc: 'Turns Poshan Tracker growth data into early warnings. Flags downward curve before SAM threshold is crossed.',    model: 'Scikit-learn + ICDS',        impact: '35% under-5s stunted' },
  { id: 'M16', name: 'Mental Health Distress',       domain: 'Health',         route: null,           desc: 'Fully opt-in. On-device processing only. Alerts only the user. Connects to free counselling resources.',         model: 'TF Lite / ONNX',            impact: '150M need care, 93% get none' },
  { id: 'M17', name: 'Household Financial Stress',   domain: 'Finance',        route: null,           desc: 'Reads UPI patterns to detect debt spiral 3–4 weeks before crisis point. Via RBI Account Aggregator.',           model: 'XGBoost + LSTM Ensemble',    impact: '13B UPI transactions/month' },
  { id: 'M18', name: 'Farmer Loan Distress',         domain: 'Finance',        route: null,           desc: 'Predicts KCC default 60 days ahead. Triggers PMFBY insurance and loan moratorium workflows automatically.',      model: 'XGBoost + Crop Data',        impact: '200K suicides since 2000' },
  { id: 'M19', name: 'Road Accident Hotspot',        domain: 'Infrastructure', route: null,           desc: "Hourly risk scores for the 5% of roads causing 80% of India's 1.5 lakh annual road fatalities.",               model: 'LightGBM + OSM',             impact: '1 death every 3.5 minutes' },
  { id: 'M20', name: 'PHC Medicine Stock-Out',       domain: 'Infrastructure', route: null,           desc: 'Predicts ORS, paracetamol and iron stock-outs 3–4 weeks ahead. Ends predictable rural health failures.',        model: 'XGBoost + HMIS Logs',        impact: 'PHCs serve 1.4B people' },
];

function ModuleCard({ mod, index }) {
  const colors   = domainColors[mod.domain] || domainColors['Health'];
  const navigate = useNavigate();
  const live     = !!mod.route;

  const handleClick = () => {
    if (live) navigate(mod.route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      onClick={handleClick}
      className={`module-card relative flex flex-col bg-[rgba(4,15,31,0.7)] border border-[rgba(45,212,191,0.07)] p-6 group transition-all duration-300 ${
        live
          ? 'cursor-pointer hover:border-teal-500/30 hover:bg-[rgba(45,212,191,0.03)]'
          : 'cursor-default opacity-70'
      }`}
      data-hover={live ? true : undefined}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="font-mono text-[0.6rem] text-slate-500 tracking-widest">{mod.id}</span>
          <span className={`ml-3 inline-block px-2 py-0.5 text-[0.58rem] tracking-widest uppercase font-mono border ${colors.bg} ${colors.text} ${colors.border}`}>
            {mod.domain}
          </span>
        </div>

        {/* Live dot vs coming-soon pill */}
        {live ? (
          <div
            className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1 flex-shrink-0"
            style={{ boxShadow: '0 0 6px #2dd4bf' }}
          />
        ) : (
          <span className="font-mono text-[0.5rem] tracking-widest text-slate-600 uppercase border border-slate-700/50 px-1.5 py-0.5 flex-shrink-0">
            soon
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className={`font-display text-lg text-white leading-tight mb-3 transition-colors duration-300 ${live ? 'group-hover:text-teal-100' : ''}`}>
        {mod.name}
      </h3>

      {/* Description */}
      <p className="text-slate-500 text-[0.78rem] leading-relaxed mb-5 flex-grow font-light">
        {mod.desc}
      </p>

      {/* Footer */}
      <div className="border-t border-[rgba(45,212,191,0.06)] pt-4 flex items-center justify-between">
        <span className="font-mono text-[0.58rem] text-slate-600 leading-tight">{mod.model}</span>
        <span className={`font-mono text-[0.58rem] ${colors.text} opacity-70`}>{mod.impact}</span>
      </div>

      {/* Arrow — only on live cards */}
      {live && (
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#2dd4bf" strokeWidth="1.5"/>
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export default function Modules() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? modules : modules.filter(m => m.domain === active);

  return (
    <section id="platform" className="py-28 px-8 bg-[#040f1f]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 pb-8 border-b border-[rgba(45,212,191,0.08)]">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-px bg-teal-400"/>
              <span className="font-mono text-xs tracking-widest text-teal-400 uppercase">The Platform</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] text-white leading-[0.95] tracking-tight"
            >
              20 Modules.<br />
              <em className="gradient-text not-italic">One</em> Pipeline.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-sm tracking-widest uppercase font-mono mt-3"
            >
              All open source · All production-grade · All real problems
            </motion.p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setActive(d)}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-mono border transition-all duration-250 ${
                  active === d
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                    : 'border-[rgba(255,255,255,0.07)] text-slate-500 hover:text-slate-300 hover:border-[rgba(45,212,191,0.2)]'
                }`}
                style={{ cursor: 'none' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[rgba(45,212,191,0.05)]"
          >
            {filtered.map((mod, i) => (
              <ModuleCard key={mod.id} mod={mod} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom count */}
        <div className="mt-8 flex items-center justify-between">
          <span className="font-mono text-xs text-slate-600">
            Showing {filtered.length} of {modules.length} modules
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"/>
            <span className="font-mono text-xs text-slate-600">All pipelines active</span>
          </div>
        </div>
      </div>
    </section>
  );
}
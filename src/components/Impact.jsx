import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  {
    num: '600M',
    label: 'On agriculture',
    desc: 'Direct or indirect dependents on farming. M01–M04 serve every one with free, data-driven crop intelligence.',
    color: 'text-emerald-400',
    glow: 'rgba(52,211,153,0.12)',
  },
  {
    num: '113',
    label: 'Maternal deaths / 100K',
    desc: 'Most are from anaemia and pre-eclampsia — conditions detectable weeks in advance. M06 closes the gap.',
    color: 'text-pink-400',
    glow: 'rgba(244,114,182,0.12)',
  },
  {
    num: '2,000+',
    label: 'Heat deaths per year',
    desc: 'Chronically undercounted. Wet-bulb temperature — not just heat — is the real killer. M12 is the only alert.',
    color: 'text-orange-400',
    glow: 'rgba(251,146,60,0.12)',
  },
  {
    num: '28%',
    label: 'Global TB burden',
    desc: '2.8 million cases annually in India. TB clusters in specific pockets. M14 maps the next cluster before it forms.',
    color: 'text-amber-400',
    glow: 'rgba(251,191,36,0.1)',
  },
  {
    num: '200,000',
    label: 'Farmer suicides since 2000',
    desc: 'Debt default is the trigger. Crop failure, price crash, and illness are all predictable. M18 gives 60 days of warning.',
    color: 'text-teal-400',
    glow: 'rgba(45,212,191,0.1)',
  },
  {
    num: '150M',
    label: 'Need mental health care',
    desc: '93% get none. India has 0.3 psychiatrists per 100,000. M16 reaches people before they reach crisis — privately.',
    color: 'text-blue-400',
    glow: 'rgba(96,165,250,0.1)',
  },
];

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="relative bg-[#040f1f] border border-[rgba(45,212,191,0.06)] p-8 overflow-hidden group hover:border-[rgba(45,212,191,0.15)] transition-all duration-400"
      style={{ boxShadow: inView ? `inset 0 0 60px ${stat.glow}` : 'none', transition: 'box-shadow 1s ease' }}
    >
      {/* Giant ghost number */}
      <div
        className={`absolute -bottom-4 -right-2 font-display text-[6rem] font-900 leading-none select-none pointer-events-none opacity-[0.04] ${stat.color}`}
        aria-hidden
      >
        {stat.num.replace(/[^0-9KM%+,]/g, '').slice(0, 4)}
      </div>

      <div className={`font-display text-[clamp(2rem,3.5vw,3.2rem)] leading-none mb-3 ${stat.color}`}>
        {stat.num}
      </div>
      <div className="text-white text-sm font-body font-500 mb-3 tracking-wide">{stat.label}</div>
      <div className="text-slate-500 text-[0.78rem] leading-relaxed font-light">{stat.desc}</div>
    </motion.div>
  );
}

export default function Impact() {
  return (
    <section id="impact" className="py-28 px-8 bg-[#020b18]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-teal-400"/>
            <span className="font-mono text-xs tracking-widest text-teal-400 uppercase">Why It Matters</span>
            <div className="w-8 h-px bg-teal-400"/>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] text-white leading-[0.95] tracking-tight"
          >
            Numbers behind<br />
            <em className="gradient-text not-italic">every module</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm leading-relaxed max-w-[50ch] mx-auto mt-5 font-light"
          >
            No module was added to fill a list. Every figure maps to NFHS-5 data, ICMR reports, CPCB data, 
            or government statistics proving the problem exists at scale.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(45,212,191,0.04)]">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>

        {/* Callout bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col lg:flex-row items-center justify-between gap-6 p-8 border border-[rgba(45,212,191,0.12)] bg-[rgba(45,212,191,0.03)]"
        >
          <div>
            <div className="text-white text-lg font-display mb-1">Early enough to act on.</div>
            <div className="text-slate-400 text-sm font-light">
              Farmers get mandi alerts 14 days ahead. Hospitals get surge warnings 48 hours ahead. That window is everything.
            </div>
          </div>
          <a
            href="#platform"
            className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 text-xs tracking-widest uppercase font-mono text-teal-400 border border-teal-500/30 hover:bg-teal-500/10 transition-all duration-300 whitespace-nowrap"
            style={{ cursor: 'none' }}
          >
            See All 20 Modules →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

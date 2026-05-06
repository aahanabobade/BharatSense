import { motion } from 'framer-motion';

const principles = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 6v5c0 4.4 3 8.5 7 9 4-0.5 7-4.6 7-9V6L10 2z" stroke="#2dd4bf" strokeWidth="1.2"/>
        <path d="M7 10l2 2 4-4" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'On-device processing',
    desc: 'Health and financial models for M05, M16, M17 run client-side. No data uploaded without explicit consent.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#2dd4bf" strokeWidth="1.2"/>
        <path d="M10 6v5l3 2" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Explicit consent only',
    desc: 'M16 (mental health) and M17 (financial) require opt-in before any data is collected. Never passive.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="3" width="12" height="14" rx="1" stroke="#2dd4bf" strokeWidth="1.2"/>
        <path d="M7 7h6M7 10h6M7 13h3" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Never diagnoses',
    desc: 'Health modules produce risk flags, not diagnoses. Clinical staff make all decisions. Clear boundaries, always.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3C6.1 3 3 6.1 3 10s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z" stroke="#2dd4bf" strokeWidth="1.2"/>
        <path d="M10 7v3l2 1" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'SHAP explanations',
    desc: 'Every prediction in health and financial modules includes an explanation. No black boxes where trust matters.',
  },
];

export default function Privacy() {
  return (
    <section className="py-20 px-8 bg-[#040f1f] border-t border-[rgba(45,212,191,0.06)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-teal-400"/>
              <span className="font-mono text-xs tracking-widest text-teal-400 uppercase">Ethics by Design</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] text-white leading-tight tracking-tight mb-5">
              Privacy is not a<br />
              <em className="gradient-text not-italic">policy footnote.</em>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-light max-w-[38ch]">
              The most sensitive modules — menstrual health, mental health, financial stress — 
              were designed from day one with privacy as a hard constraint, not an afterthought.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(45,212,191,0.04)]">
            {principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#040f1f] p-6 flex gap-4"
              >
                <div className="flex-shrink-0 mt-0.5">{p.icon}</div>
                <div>
                  <div className="text-white text-sm font-body font-500 mb-2">{p.title}</div>
                  <div className="text-slate-500 text-[0.75rem] leading-relaxed font-light">{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

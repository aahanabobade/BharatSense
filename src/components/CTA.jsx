import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-32 px-8 bg-[#020b18] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[rgba(45,212,191,0.04)]"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[rgba(45,212,191,0.06)]"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[rgba(45,212,191,0.08)]"/>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)' }}
        />
        {/* Grid */}
        <div className="absolute inset-0 grid-overlay opacity-60"/>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-8 h-px bg-teal-400"/>
          <span className="font-mono text-xs tracking-widest text-teal-400 uppercase">Get Early Access</span>
          <div className="w-8 h-px bg-teal-400"/>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,6vw,6rem)] text-white leading-[0.92] tracking-tight mb-8"
        >
          Predict crisis.<br />
          <em className="gradient-text not-italic">Enable action.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-base leading-relaxed max-w-[44ch] mx-auto mb-12 font-light"
        >
          BharatSense is built for the 90% — farmers, women, daily-wage workers, government 
          health workers — who have never had access to predictive intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#platform"
            className="flex items-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-[#020b18] text-sm font-body font-500 tracking-widest uppercase transition-all duration-300 w-full sm:w-auto justify-center"
            style={{ cursor: 'none', boxShadow: '0 0 40px rgba(45,212,191,0.2)' }}
          >
            Explore All 20 Modules
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </a>
          <a
            href="#architecture"
            className="flex items-center gap-3 px-8 py-4 text-sm font-body tracking-widest uppercase text-slate-300 hover:text-white border border-[rgba(45,212,191,0.15)] hover:border-[rgba(45,212,191,0.35)] transition-all duration-300 w-full sm:w-auto justify-center"
            style={{ cursor: 'none' }}
          >
            View Architecture
          </a>
        </motion.div>

        {/* Bottom tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-[rgba(45,212,191,0.08)]"
        >
          {['100% Open Source', '0 Paid Tools Required', 'Runs on One Laptop', 'SMS Fallback Included'].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-teal-400"/>
              <span className="font-mono text-[0.6rem] text-slate-500 tracking-widest uppercase hidden sm:block">{t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

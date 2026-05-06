import { motion } from 'framer-motion';

const stages = [
  {
    num: '01',
    title: 'Data Ingestion & Validation',
    desc: 'Real-time Kafka streams, batch ETL, and automated Great Expectations checks before any data enters training.',
    tools: ['Apache Kafka', 'Great Expectations', 'DVC', 'Airflow', 'Apache Spark'],
    color: 'text-teal-400',
  },
  {
    num: '02',
    title: 'Feature Store',
    desc: 'Feast centralises computed features. Every model across all 20 modules pulls from the same store — no redundancy.',
    tools: ['Feast', 'Pandas', 'Polars', 'tsfresh', 'GeoPandas', 'H3'],
    color: 'text-blue-400',
  },
  {
    num: '03',
    title: 'Training & Experiment Tracking',
    desc: 'MLflow tracks every run. SHAP generates explanations. Optuna tunes automatically. Champion/challenger registry.',
    tools: ['MLflow', 'XGBoost', 'LightGBM', 'PyTorch', 'SHAP', 'Optuna', 'scikit-learn'],
    color: 'text-emerald-400',
  },
  {
    num: '04',
    title: 'Serving & Deployment',
    desc: 'FastAPI endpoints, Docker containers, SMS fallback via Twilio for farmers and rural users without smartphones.',
    tools: ['FastAPI', 'Docker', 'MLflow serve', 'Twilio SMS', 'MSG91'],
    color: 'text-violet-400',
  },
  {
    num: '05',
    title: 'Monitoring & Auto-Retraining',
    desc: 'Evidently AI detects drift weekly. Airflow triggers retraining automatically. Grafana shows all 20 models live.',
    tools: ['Evidently AI', 'Prometheus', 'Grafana', 'Airflow DAGs'],
    color: 'text-pink-400',
  },
];

const dataSources = [
  { name: 'Open-Meteo', desc: 'Weather · No key required', tag: 'Free' },
  { name: 'OpenAQ + CPCB', desc: 'Air quality sensors across India', tag: 'Free' },
  { name: 'Agmarknet API', desc: 'Daily mandi prices · Govt of India', tag: 'Free' },
  { name: 'NASA MODIS / Copernicus', desc: 'NDVI · Soil moisture · Satellite', tag: 'Free' },
  { name: 'HMIS + NIKSHAY', desc: 'Health management data · MoU', tag: 'Gov' },
  { name: 'OpenStreetMap', desc: 'Roads · Infrastructure · Global', tag: 'Free' },
  { name: 'CWC + CGWB', desc: 'River gauges · Groundwater monitoring', tag: 'Free' },
  { name: 'NCRB Open Data', desc: 'Crime statistics · data.gov.in', tag: 'Free' },
];

export default function Architecture() {
  return (
    <section id="architecture" className="py-28 px-8 bg-[#040f1f]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-teal-400"/>
            <span className="font-mono text-xs tracking-widest text-teal-400 uppercase">MLOps Architecture</span>
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] text-white leading-[0.95] tracking-tight max-w-[12ch]"
            >
              One backbone.<br />
              <em className="gradient-text not-italic">Twenty</em> models.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm leading-relaxed max-w-[42ch] font-light lg:text-right"
            >
              Build the infrastructure once — properly — and each new module is a model 
              plugged into an already-working pipeline. The model is 10% of the work. 
              The pipeline is the other 90%.
            </motion.p>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
          {/* Pipeline stages */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/40 via-blue-500/40 to-pink-500/20"/>

            {stages.map((stage, i) => (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                {/* Stage number */}
                <div
                  className="relative z-10 w-12 h-12 flex-shrink-0 border font-mono text-xs flex items-center justify-center bg-[#040f1f]"
                  style={{ borderColor: 'rgba(45,212,191,0.2)', color: '#2dd4bf' }}
                >
                  {stage.num}
                </div>

                <div className="pt-1">
                  <h3 className={`text-sm font-body font-500 mb-2 ${stage.color}`}>{stage.title}</h3>
                  <p className="text-slate-500 text-[0.78rem] leading-relaxed mb-3 font-light">{stage.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.tools.map(t => (
                      <span
                        key={t}
                        className="font-mono text-[0.6rem] px-2 py-0.5 bg-[rgba(45,212,191,0.05)] border border-[rgba(45,212,191,0.1)] text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Data sources + facts */}
          <div>
            {/* Data sources grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-5">
                Free Data Sources
              </div>
              <div className="grid grid-cols-2 gap-px bg-[rgba(45,212,191,0.04)]">
                {dataSources.map((ds, i) => (
                  <div key={i} className="bg-[#040f1f] p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-white text-[0.78rem] font-body font-400 leading-tight">{ds.name}</span>
                      <span className="font-mono text-[0.55rem] px-1.5 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 flex-shrink-0">
                        {ds.tag}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[0.68rem] font-light">{ds.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Facts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-px bg-[rgba(45,212,191,0.04)]"
            >
              {[
                { v: '0', label: 'Paid tools required', unit: '' },
                { v: '$0', label: 'Monthly cloud cost', unit: '' },
                { v: '1', label: 'Laptop to run it all', unit: '' },
              ].map((f, i) => (
                <div key={i} className="bg-[#040f1f] p-5 text-center">
                  <div className="font-display text-3xl text-teal-400 mb-1">{f.v}</div>
                  <div className="font-mono text-[0.6rem] text-slate-500 tracking-widest uppercase leading-tight">{f.label}</div>
                </div>
              ))}
            </motion.div>

            {/* SMS fallback note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex items-start gap-3 p-4 border border-[rgba(45,212,191,0.1)] bg-[rgba(45,212,191,0.03)]"
            >
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="3" width="16" height="13" rx="1" stroke="#2dd4bf" strokeWidth="1.2"/>
                  <path d="M6 8h8M6 11h5" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="text-white text-xs font-body font-500 mb-1">SMS fallback for rural reach</div>
                <div className="text-slate-500 text-[0.72rem] font-light leading-relaxed">
                  Alerts delivered via SMS in Hindi, Marathi, Punjabi, and Tamil. Works on any feature phone. 
                  No smartphone required.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

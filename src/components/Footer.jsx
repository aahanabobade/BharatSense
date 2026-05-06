export default function Footer() {
  return (
    <footer className="bg-[#020b18] border-t border-[rgba(45,212,191,0.06)] px-8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6">
                <svg viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="rgba(45,212,191,0.3)" strokeWidth="1"/>
                  <circle cx="16" cy="16" r="4" fill="#2dd4bf"/>
                </svg>
              </div>
              <span className="font-display text-lg text-white">
                Bharat<span className="text-teal-400">Sense</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-light max-w-[24ch]">
              Predictive intelligence for rural and urban India. 20 modules. 100% open source. Built for the 90%.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"/>
              <span className="font-mono text-[0.6rem] text-slate-500 tracking-widest">All pipelines active</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="font-mono text-[0.6rem] text-teal-400 tracking-widest uppercase mb-4">Platform</div>
            <ul className="space-y-3">
              {['All 20 Modules', 'Architecture', 'Data Sources', 'API Reference', 'Monitoring'].map(l => (
                <li key={l}>
                  <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors duration-200 font-light" style={{ cursor: 'none' }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Domains */}
          <div>
            <div className="font-mono text-[0.6rem] text-teal-400 tracking-widest uppercase mb-4">Domains</div>
            <ul className="space-y-3">
              {['Agriculture', "Women's Health", 'Water & Environment', 'Urban Health', 'Finance', 'Infrastructure'].map(l => (
                <li key={l}>
                  <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors duration-200 font-light" style={{ cursor: 'none' }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="font-mono text-[0.6rem] text-teal-400 tracking-widest uppercase mb-4">Connect</div>
            <ul className="space-y-3">
              {['Documentation', 'Contribute', 'Research Partners', 'Government', 'Contact'].map(l => (
                <li key={l}>
                  <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors duration-200 font-light" style={{ cursor: 'none' }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[rgba(45,212,191,0.06)]">
          <span className="font-mono text-[0.6rem] text-slate-600 tracking-widest">
            © 2025 BharatSense — MIT License — Open Source
          </span>
          <div className="flex gap-8">
            {['Privacy', 'License', 'Ethics Charter'].map(l => (
              <a key={l} href="#" className="font-mono text-[0.6rem] text-slate-600 hover:text-slate-400 tracking-widest uppercase transition-colors" style={{ cursor: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

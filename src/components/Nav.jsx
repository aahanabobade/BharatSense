import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = ['Platform', 'Impact', 'Architecture', 'Domains'];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // apply class on mount
    document.documentElement.classList.toggle('light', !dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => setDark(d => !d);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(2,11,24,0.92)] backdrop-blur-xl border-b border-[rgba(45,212,191,0.08)]'
            : ''
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group" style={{ cursor: 'none' }}>
          <div className="w-8 h-8 relative">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="rgba(45,212,191,0.3)" strokeWidth="1"/>
              <circle cx="16" cy="16" r="9"  stroke="rgba(45,212,191,0.5)" strokeWidth="1"/>
              <circle cx="16" cy="16" r="4"  fill="#2dd4bf"/>
              <line x1="16" y1="2"  x2="16" y2="8"  stroke="#2dd4bf" strokeWidth="1" opacity="0.6"/>
              <line x1="16" y1="24" x2="16" y2="30" stroke="#2dd4bf" strokeWidth="1" opacity="0.6"/>
              <line x1="2"  y1="16" x2="8"  y2="16" stroke="#2dd4bf" strokeWidth="1" opacity="0.6"/>
              <line x1="24" y1="16" x2="30" y2="16" stroke="#2dd4bf" strokeWidth="1" opacity="0.6"/>
            </svg>
          </div>
          <span className="title-word font-display text-xl tracking-tight" style={{ color: 'var(--text-heading)' }}>
            <span className="en">Bharat<span className="text-teal-400">Sense</span></span>
            <span className="hi" style={{ fontSize: '1em' }}>भारतसेंस</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <li key={item}>
              
               <a href={`#${item.toLowerCase()}`}
                className="nav-link relative text-sm tracking-widest uppercase font-body transition-colors duration-300"
                style={{ color: 'var(--text-muted)', cursor: 'none' }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side — theme toggle only */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            style={{ cursor: 'none' }}
            className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-mono border border-[rgba(45,212,191,0.25)] text-teal-400 hover:bg-[rgba(45,212,191,0.08)] transition-all duration-300"
            aria-label="Toggle theme"
          >
            {dark ? (
              /* Sun icon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ cursor: 'none' }}
        >
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: 'var(--text-heading)' }}/>
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: 'var(--text-heading)' }}/>
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: 'var(--text-heading)' }}/>
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-40 pt-24 pb-10 px-8 backdrop-blur-xl border-b border-[rgba(45,212,191,0.1)]"
            style={{ background: 'var(--bg-primary)' }}
          >
            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className="mb-6 flex items-center gap-2 text-xs tracking-widest uppercase font-mono text-teal-400"
              style={{ cursor: 'none' }}
            >
              {dark ? '☀ Light Mode' : '☾ Dark Mode'}
            </button>
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setMenuOpen(false)}
                className="block py-4 text-2xl font-display border-b border-[rgba(45,212,191,0.08)]"
                style={{ color: 'var(--text-heading)', cursor: 'none' }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
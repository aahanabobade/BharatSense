import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  let mx = 0, my = 0, rx = 0, ry = 0;
  let raf;

  useEffect(() => {
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };

    const animRing = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      raf = requestAnimationFrame(animRing);
    };

    const onDown = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(2)';
      if (ringRef.current) { ringRef.current.style.width = '24px'; ringRef.current.style.height = '24px'; }
    };
    const onUp = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
      if (ringRef.current) { ringRef.current.style.width = '40px'; ringRef.current.style.height = '40px'; }
    };

    const onEnter = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '56px';
        ringRef.current.style.height = '56px';
        ringRef.current.style.borderColor = 'rgba(45,212,191,0.6)';
      }
    };
    const onLeave = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '40px';
        ringRef.current.style.height = '40px';
        ringRef.current.style.borderColor = 'rgba(45,212,191,0.35)';
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    raf = requestAnimationFrame(animRing);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

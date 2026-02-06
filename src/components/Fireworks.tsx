'use client';
import { useEffect, useRef } from 'react';
import './Fireworks.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  angle: number;
  distance: number;
}

const Fireworks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  const colorSchemes = [
    ['#00ff00', '#66ff66', '#33ff33'],
    ['#ff0000', '#ff6666', '#ff3333'],
    ['#ffff00', '#ffff66', '#ffcc00'],
    ['#0088ff', '#66bbff', '#0066cc'],
    ['#ff00ff', '#ff66ff', '#ff33ff'],
    ['#ff8800', '#ffaa44', '#ff6600'],
  ];

  const createParticle = (
    x: number,
    y: number,
    colors: string[],
    count: number
  ) => {
    if (!containerRef.current) return;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 1.5 + Math.random() * 0.8;

      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      particle.style.cssText = `
        left: ${x * 100}%;
        top: ${y * 100}%;
        background-color: ${color};
        --end-x: ${endX}px;
        --end-y: ${endY}px;
        --duration: ${duration}s;
        animation: burst ${duration}s ease-out forwards;
      `;

      containerRef.current.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }
  };

  useEffect(() => {
    let isActive = true;

    // Initial burst of fireworks
    const initialTimeouts = [
      setTimeout(() => {
        if (isActive) createParticle(0.2, 0.4, colorSchemes[0], 25);
      }, 100),
      setTimeout(() => {
        if (isActive) createParticle(0.8, 0.35, colorSchemes[1], 25);
      }, 800),
      setTimeout(() => {
        if (isActive) createParticle(0.5, 0.45, colorSchemes[2], 25);
      }, 1600),
    ];

    // Continuous random fireworks
    const scheduleRandomFirework = () => {
      if (!isActive) return;

      const randomX = 0.2 + Math.random() * 0.6;
      const randomY = 0.35 + Math.random() * 0.3;
      const randomColors =
        colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      const randomDelay = 2500 + Math.random() * 2000;

      const timeout = setTimeout(() => {
        if (isActive) {
          createParticle(randomX, randomY, randomColors, 20);
          scheduleRandomFirework();
        }
      }, randomDelay);

      initialTimeouts.push(timeout);
    };

    setTimeout(() => {
      if (isActive) scheduleRandomFirework();
    }, 2500);

    return () => {
      isActive = false;
      initialTimeouts.forEach(clearTimeout);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }} />;
};

export default Fireworks;
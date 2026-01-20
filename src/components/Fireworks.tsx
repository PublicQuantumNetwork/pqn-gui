'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Fireworks = () => {
  useEffect(() => {
    const colorSchemes = [
      ['#00ff00', '#66ff66', '#33ff33'],
      ['#ff0000', '#ff6666', '#ff3333'],
      ['#ffff00', '#ffff66', '#ffcc00'],
      ['#0088ff', '#66bbff', '#0066cc'],
      ['#ff00ff', '#ff66ff', '#ff33ff'],
      ['#ff8800', '#ffaa44', '#ff6600'],
    ];

    const fireFirework = (x: number, y: number, colors: string[]) => {
      const count = 80;
      const defaults = {
        origin: { x, y },
        zIndex: 1000,
      };

      confetti({
        ...defaults,
        particleCount: count,
        spread: 60,
        colors,
        startVelocity: 45,
        gravity: 1.2,
        scalar: 1.8,
        ticks: 200,
      });

      // Secondary burst for more dramatic effect
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: count / 2,
          spread: 100,
          colors,
          startVelocity: 30,
          gravity: 1,
          scalar: 1.5,
          ticks: 200,
        });
      }, 150);
    };

    const scheduleRandomFirework = () => {
      const randomX = 0.2 + Math.random() * 0.6; // Between 0.2 and 0.8
      const randomY = 0.35 + Math.random() * 0.3; // Between 0.35 and 0.65
      const randomColors =
        colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      const randomDelay = 800 + Math.random() * 1200; // Between 800ms and 2000ms

      return setTimeout(() => {
        fireFirework(randomX, randomY, randomColors);
        scheduleRandomFirework();
      }, randomDelay);
    };

    // Start with initial burst of fireworks
    const initialTimers: NodeJS.Timeout[] = [];

    initialTimers.push(
      setTimeout(() => {
        fireFirework(0.2, 0.4, colorSchemes[0]);
      }, 100)
    );

    initialTimers.push(
      setTimeout(() => {
        fireFirework(0.8, 0.35, colorSchemes[1]);
      }, 800)
    );

    initialTimers.push(
      setTimeout(() => {
        fireFirework(0.5, 0.45, colorSchemes[2]);
      }, 1600)
    );

    // Start continuous random fireworks after initial burst
    const continuousTimer = setTimeout(() => {
      scheduleRandomFirework();
    }, 2500);

    return () => {
      initialTimers.forEach((timer) => clearTimeout(timer));
      clearTimeout(continuousTimer);
    };
  }, []);

  return null;
};

export default Fireworks;
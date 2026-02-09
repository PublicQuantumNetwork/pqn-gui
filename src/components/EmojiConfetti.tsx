'use client';
import { useEffect, useRef } from 'react';
import './EmojiConfetti.css';

interface EmojiConfettiProps {
  emoji: string;
  triggerKey?: number;
  emojiRef: React.RefObject<HTMLDivElement | null>;
}

const EmojiConfetti = ({ emoji, triggerKey, emojiRef }: EmojiConfettiProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createEmojiParticles = () => {
    if (!containerRef.current || !emojiRef.current) return;

    const rect = emojiRef.current.getBoundingClientRect();
    const centerX = (rect.left + rect.width / 2) / window.innerWidth;
    const centerY = (rect.top + rect.height / 2) / window.innerHeight;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 120 + Math.random() * 180;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      const duration = 1.2 + Math.random() * 0.6;
      const delay = Math.random() * 0.1;

      const particle = document.createElement('div');
      particle.className = 'emoji-confetti-particle';
      particle.textContent = emoji;
      particle.style.cssText = `
        left: ${centerX * 100}%;
        top: ${centerY * 100}%;
        --end-x: ${endX}px;
        --end-y: ${endY}px;
        --duration: ${duration}s;
        --delay: ${delay}s;
        animation: emoji-burst ${duration}s ease-out ${delay}s forwards;
        transform: translate(-50%, -50%);
      `;

      containerRef.current.appendChild(particle);

      setTimeout(
        () => {
          particle.remove();
        },
        (duration + delay) * 1000
      );
    }
  };

  useEffect(() => {
    createEmojiParticles();
  }, [triggerKey]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
};

export default EmojiConfetti;

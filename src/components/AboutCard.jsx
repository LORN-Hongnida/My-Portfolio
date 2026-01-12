// src/components/AboutCard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const AboutCard = ({ module, isHovered, orbStatus }) => {
  const [hasBeenDecrypted, setHasBeenDecrypted] = useState(false);

  useEffect(() => {
    let timer;
    
    if (isHovered) {
      // PHASE 1: Immediate "Scanning" message
      if (orbStatus !== 'sleeping') {
        window.dispatchEvent(new CustomEvent('orb-say', { 
          detail: `Scanning ${module.id.toUpperCase()} data...` 
        }));
      }

      // PHASE 2: Wait for decryption (1.5s), then show remark
      timer = setTimeout(() => {
        setHasBeenDecrypted(true);
        if (orbStatus !== 'sleeping' && module.remark) {
          window.dispatchEvent(new CustomEvent('orb-say', { 
            detail: module.remark 
          }));
        }
      }, 1500);
    } else {
      // Reset state if needed when mouse leaves
      // The OrbTrigger parent will handle clearing the message
    }

    return () => clearTimeout(timer);
  }, [isHovered, module.id, module.remark, orbStatus]);

  return (
    <motion.div 
      animate={{ height: isHovered ? 240 : 100 }}
      className={`relative p-6 border rounded-2xl overflow-hidden transition-all duration-500
        ${isHovered ? 'border-accent/50 bg-accent/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-app-text/20 bg-transparent'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-mono text-accent tracking-widest uppercase">
          {module.header}
        </span>
        <span className="text-[10px] font-mono opacity-40 uppercase text-app-text">
          {hasBeenDecrypted ? "[SECURE]" : "[ENCRYPTED]"}
        </span>
      </div>

      <h4 className="text-xl font-bold text-app-text mb-4 uppercase tracking-tighter">
        {module.id}
      </h4>

      <div className={`transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-app-text/70 leading-relaxed font-light">
          <DecryptText text={module.content} active={isHovered && !hasBeenDecrypted} />
        </p>
      </div>

      {isHovered && !hasBeenDecrypted && (
        <div className="animate-scan-move inset-x-0 h-[2px] bg-accent/50 blur-sm"></div>
      )}
    </motion.div>
  );
};

export default AboutCard;
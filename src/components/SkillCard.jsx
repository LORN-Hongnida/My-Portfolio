// src/components/SkillCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SkillCard = ({ skill, isHovered }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative p-4 flex flex-col items-center justify-center border rounded-xl transition-all duration-300 
        ${isHovered ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-gray/80 border-accent/10 bg-accent/5'}`}
    >
      {/* Icon Placeholder - You can add your SVG icons here later */}
      <div className={`w-12 h-12 mb-3 rounded-lg flex items-center justify-center text-2xl transition-colors
        ${isHovered ? 'text-accent' : 'opacity-10'}`}>
        {skill.icon ? (
  <img 
    src={skill.icon} 
    alt={skill.name} 
    className="w-6 h-6 object-contain" // adjust size/styling as needed
  />
) : (
  skill.name[0]
)}

      </div>
      
      <span className={`font-mono text-xs tracking-widest uppercase transition-opacity
        ${isHovered ? 'text-app-text opacity-100' : 'text-app-text/60 opacity-80'}`}>
        {skill.name}
      </span>

      {/* Subtle background glow when hovered */}
      {isHovered && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-accent/10 blur-xl rounded-xl -z-10"
        />
      )}
      
    </motion.div>
  );
};

export default SkillCard;
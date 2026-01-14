import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { skills } from '../data/data';
import SkillCard from './SkillCard';

const Skills = ({ orbStatus }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDockMessage, setShowDockMessage] = useState(false);
  const [isOrbDocked, setIsOrbDocked] = useState(false);
  const angleStep = 360 / skills.length;

  // charge ring config
  const radius = 240;
  const circumference = 2 * Math.PI * radius;
  const totalDashes = 40;
  const dashLength = circumference / totalDashes;
  const gapLength = dashLength / 2;

  const rotationDegrees = useMotionValue(0);
  const smoothRotation = useSpring(rotationDegrees, { damping: 30, stiffness: 100 });

  // handle Esc key & docking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'skill-dock', active: false } }));
      if (e.key === 'ArrowLeft') rotateLeft();
      if (e.key === 'ArrowRight') rotateRight();
    };
    const handleDockChange = (e) => {
      const detail = e.detail;
      if (typeof detail === 'object') {
        // New format: { target: 'skill-dock', active: true/false }
        if (detail.target === 'skill-dock') {
          setIsOrbDocked(detail.active);
        }
      } else {
        // Legacy format: boolean
        setIsOrbDocked(detail);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('orb-dock', handleDockChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('orb-dock', handleDockChange);
    };
  }, [selectedIndex, orbStatus]);

  // dock message
  useEffect(() => {
    setShowDockMessage(orbStatus === 'sleeping' || !isOrbDocked);
  }, [orbStatus, isOrbDocked]);

  // rotation helpers (INVERTED DIRECTION)
  const bringToFront = useCallback((index) => {
    setSelectedIndex(index);
    // CHANGE: Inverted from -(index * angleStep) to +(index * angleStep) for clockwise logic
    const targetRotation = (index * angleStep); 
    const currentRotation = rotationDegrees.get();
    let relativeRotation = (targetRotation - currentRotation) % 360;
    if (relativeRotation > 180) relativeRotation -= 360;
    if (relativeRotation < -180) relativeRotation += 360;

    animate(rotationDegrees, currentRotation + relativeRotation, {
      type: "spring", bounce: 0.1, duration: 1.2,
      onComplete: () => {
        if (orbStatus !== 'sleeping') {
          window.dispatchEvent(new CustomEvent('orb-say', { detail: skills[index].info }));
        }
      }
    });
  }, [angleStep, rotationDegrees, orbStatus]);

  const rotateLeft = () => {
    const newIndex = (selectedIndex - 1 + skills.length) % skills.length;
    bringToFront(newIndex);
    if (orbStatus !== 'sleeping') window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'skill-dock', active: true } }));
  };

  const rotateRight = () => {
    const newIndex = (selectedIndex + 1) % skills.length;
    bringToFront(newIndex);
    if (orbStatus !== 'sleeping') window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'skill-dock', active: true } }));
  };

  return (
    <section
      id="skills"
      className="relative min-h-screen py-20 bg-app-bg flex flex-col items-center justify-center overflow-hidden"
      onMouseEnter={() => {
        if (orbStatus !== 'sleeping') {
          window.dispatchEvent(new CustomEvent('orb-say', { detail: "Interact with the modules to see detailed specs." }));
        }
      }}
    >
      <div className="absolute top-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full"></div>

      <div className="z-10 text-center mb-10 px-4">
        <h2 className="text-app-text text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
          Technical <span className="text-accent">Arsenal</span>
        </h2>
        <p className="text-app-text/60 font-mono text-[10px] tracking-[0.3em] uppercase">
          ←→ arrows • drag to rotate • click to inspect • esc to release
        </p>
      </div>

      <div className="relative w-full max-w-6xl flex items-center justify-center h-[50vh]">

        {/* Outer ring */}
        <div className="w-[600px] h-[600px] border-2 border-accent/30 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
        
        {/* Charge ring container */}
        <div className="absolute" style={{ width: '500px', height: '500px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <svg width="500" height="500" className="absolute inset-0" style={{ transform: 'rotateX(75deg) rotate(-90deg)' }}>
            {/* Background Ring (Static) */}
            <circle
              cx="250" cy="250" r={radius}
              fill="none" stroke="var(--accent-color)" strokeWidth="1"
              className="opacity-10"
              strokeDasharray={`${dashLength} ${gapLength}`}
            />
            {/* Reactive Ring */}
            <circle
              cx="250" cy="250" r={radius}
              fill="none" stroke="var(--accent-color)" strokeWidth="2"
              strokeDasharray={`${dashLength} ${gapLength}`}
              className={`transition-all duration-700 ease-in-out ${
                isOrbDocked 
                  ? 'stroke-accent opacity-100' 
                  : 'stroke-accent/20 opacity-30'
              }`}
              style={{ 
                filter: isOrbDocked ? 'drop-shadow(0 0 12px var(--accent-color))' : 'none',
              }}
            />
          </svg>
        

          {/* PERCENTAGE - FLAT PERSPECTIVE STYLE */}
          <div
            className="absolute left-1/2 flex items-center justify-center"
            style={{
              top: '50%',
              // Positioned on the front edge of the 500px container
              transform: 'translateX(-50%) translateY(210px) rotateX(65deg)',
              color: isOrbDocked ? 'var(--accent)' : 'rgba(99,102,241,0.2)',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '24px',
              letterSpacing: '0.1em',
              textShadow: isOrbDocked ? '0 0 15px var(--accent)' : 'none',
              transition: 'all 0.5s ease'
            }}
          >
             {isOrbDocked ? `--- ${skills[selectedIndex]?.level}% ---` : "--- 0% ---"}
              {/* Undock button when docked */}
            {isOrbDocked && (
              <button
                onClick={() => {
                  setIsOrbDocked(false);
                  window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'skill-dock', active: false } }));
                }}
                className="relative -top-2 -right-2 w-6 h-6 rounded-full bg-accent/20 hover:bg-accent/40 text-accent hover:text-white transition-all duration-200 flex items-center justify-center text-xs font-bold pointer-events-auto z-10"
                title="Release Orb (ESC)"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="absolute w-98 h-100 bg-accent/10 blur-3xl rounded-full" style={{ transform: 'rotateX(75deg)' }}></div>
          <div className="absolute w-28 h-30 bg-accent/50 blur-3xl rounded-full" style={{ transform: 'rotateX(75deg)' }}></div>

          <div className="inner-dock-container pointer-events-none">
            <div id="skill-dock" className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center shadow-[0_0_80px_rgba(var(--accent-rgb),0.2)]">
              <div className="w-6 h-6 bg-accent rounded-full animate-pulse shadow-[0_0_20px_var(--accent)]" />
              
          </div>
        </div>

        {/* Dock message (MOVED DOWN) */}
        {showDockMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, rotate: [0, 2, -2, 0], scale: [1, 1.05, 1] }}
            transition={{ opacity: { duration: 0.5 }, y: { duration: 0.5 }, rotate: { duration: 4, repeat: Infinity }, scale: { duration: 3, repeat: Infinity } }}
            className="dock-message absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ marginTop: '-100px' }} // Changed from -140px to -100px to move it down
          >
            <div className="relative">
              Wake the orb up for more info!
              <div className="absolute inset-0 bg-accent/10 rounded-lg blur-sm animate-pulse"></div>
            </div>
          </motion.div>
        )}

        {/* Drag interaction (INVERTED SENSITIVITY) */}
        <motion.div
          className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => { if (orbStatus !== 'sleeping') window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'skill-dock', active: true } })); }}
          // Changed delta.x * 0.5 to -0.5 to match the inverted rotation logic
          onDrag={(_, info) => rotationDegrees.set(rotationDegrees.get() - info.delta.x * 0.5)}
          onDragEnd={(_, info) => {
            const velocityOffset = -info.velocity.x / 10;
            const closestIndex = Math.round((rotationDegrees.get() - velocityOffset) / angleStep);
            bringToFront((closestIndex % skills.length + skills.length) % skills.length);
          }}
        />

        {skills.map((skill, index) => (
          <SkillOrbitItem
            key={skill.name}
            skill={skill}
            index={index}
            total={skills.length}
            rotation={smoothRotation}
            orbStatus={orbStatus}
            isSelected={selectedIndex === index}
            isHovered={hoveredSkill === skill.name}
            setHoveredSkill={setHoveredSkill}
            onClick={() => {
              bringToFront(index);
              if (orbStatus !== 'sleeping') window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'skill-dock', active: true } }));
            }}
          />
        ))}

      </div>
    </section>
  );
};

const SkillOrbitItem = ({ skill, index, total, rotation, orbStatus, isSelected, isHovered, setHoveredSkill, onClick }) => {
  const [style, setStyle] = useState({ x: 0, y: 0, scale: 0.5, opacity: 0 });
  const angleStep = 360 / total;

  useEffect(() => {
    const update = (latest) => {
      // Adjusted angle logic to match inverted clockwise rotation
      const angle = (index * angleStep) - latest + 90;
      const rad = angle * (Math.PI / 180);
      const rx = window.innerWidth < 768 ? window.innerWidth * 0.35 : 450;
      const ry = window.innerWidth < 768 ? 80 : 140;
      const x = Math.cos(rad) * rx;
      const y = Math.sin(rad) * ry;
      const depthFactor = (y + ry) / (2 * ry);
      setStyle({ x, y, scale: (window.innerWidth < 768 ? 0.4 : 0.55) + depthFactor * 0.45, opacity: 0.15 + depthFactor * 0.85, zIndex: Math.round(y + 200) });
    };
    update(rotation.get());
    return rotation.onChange(update);
  }, [index, rotation, angleStep]);

  return (
    <motion.div
      style={{ position: 'absolute', x: style.x, y: style.y, scale: style.scale, zIndex: style.zIndex, opacity: style.opacity }}
      onClick={onClick}
      onMouseEnter={() => setHoveredSkill(skill.name)}
      onMouseLeave={() => setHoveredSkill(null)}
      className="skill-card-container cursor-pointer"
    >
      <div className={`skill-card-glow ${isHovered ? 'opacity-20' : 'opacity-0'}`} />
      <div className={`transition-transform duration-500 ${isSelected ? 'scale-110' : ''}`}>
        <SkillCard skill={skill} isHovered={isHovered || isSelected} />
      </div>
    </motion.div>
  );
};

export default Skills;
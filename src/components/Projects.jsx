import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fallbackProjects } from '../data/data';

const Projects = ({ projects = fallbackProjects, orbStatus }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDocked, setIsDocked] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const typingIntervalRef = useRef(null);

  // Typing effect for description
  const startTyping = (text) => {
    setTypedText('');
    setIsTyping(true);
    setCanSkip(true);
    
    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
        setTimeout(() => setCanSkip(false), 1000); // Allow skip to disappear after typing completes
      }
    }, 50); // Typing speed
  };

  const skipTyping = () => {
    if (canSkip && isTyping && typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      const fullText = projects[currentIndex]?.remarks || "Diagnostic complete.";
      setTypedText(fullText);
      setIsTyping(false);
      setCanSkip(false);
    }
  };

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setShowDescription(false);
    setTypedText('');
    setIsTyping(false);
    setCanSkip(false);
    if (isDocked) {
      window.dispatchEvent(new CustomEvent('project-changed'));
    }
  };
  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setShowDescription(false);
    setTypedText('');
    setIsTyping(false);
    setCanSkip(false);
    if (isDocked) {
      window.dispatchEvent(new CustomEvent('project-changed'));
    }
  };

  // Remove automatic scroll detection, use manual click instead
  // Add click handler for manual docking
  const handleStationClick = () => {
    if (orbStatus !== 'sleeping' && !isDocked) {
      setIsDocked(true);
      window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'project-station', active: true } }));
    }
  };

  // Handle undock on Esc key only (remove scroll-off auto undocking)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDocked) {
        setIsDocked(false);
        window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'project-station', active: false } }));
      }
    };

    // Listen for dock state changes from Assistant.jsx
    const handleDockChange = (e) => {
      const detail = e.detail;
      if (typeof detail === 'object' && detail.target === 'project-station') {
        setIsDocked(detail.active);
        if (!detail.active) {
          setShowDescription(false);
          setTypedText('');
          setIsTyping(false);
          setCanSkip(false);
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }
      }
    };

    // Listen for description show event from Assistant
    const handleShowDescription = () => {
      setShowDescription(true);
      const text = projects[currentIndex]?.remarks || "Diagnostic complete.";
      startTyping(text);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('orb-dock', handleDockChange);
    window.addEventListener('show-project-description', handleShowDescription);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('orb-dock', handleDockChange);
      window.removeEventListener('show-project-description', handleShowDescription);
    };
  }, [isDocked, currentIndex, projects]);

  // Reset description when undocking
  useEffect(() => {
    if (!isDocked) {
      setShowDescription(false);
      setTypedText('');
      setIsTyping(false);
      setCanSkip(false);
    }
  }, [isDocked]);

  // Manual undock button handler
  const handleUndock = () => {
    if (isDocked) {
      setIsDocked(false);
      window.dispatchEvent(new CustomEvent('orb-dock', { detail: { target: 'project-station', active: false } }));
    }
  };

  return (
    <section id="projects" className="relative min-h-screen bg-app-bg transition-colors duration-500 flex items-center justify-center py-24 px-6 overflow-hidden text-app-text">
      
      {/* Dynamic Background Pattern - Futuristic Grid */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(var(--accent-rgb), 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb), 0.1) 1px, transparent 1px)
          `, 
          backgroundSize: '50px 50px' 
        }} 
      />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start z-10">
        
        {/* --- LEFT COLUMN: THE STATION --- */}
        {/* Changed to justify-start and fixed width/min-height to stop jumping */}
        <div className="lg:col-span-4 flex flex-col justify-start gap-6 min-h-[500px]">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
              Featured <br />
              <span className="text-accent">Projects</span>
            </h2>
            <div className="h-1 w-12 bg-accent mt-4" />
          </div>

          <div className="relative mt-4 border-l-2 border-accent/20 pl-6 py-2 bg-gradient-to-r from-accent/5 via-purple-400/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase opacity-70">Station_Alpha_01</span>
            </div>

            <div 
              id="project-station" 
              className={`w-full h-44 rounded-xl border backdrop-blur-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 cursor-pointer ${
                isDocked 
                  ? 'border-accent/60 bg-accent/10 shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)]' 
                  : 'border-accent/10 bg-black/5 dark:bg-white/5 hover:border-accent/30 hover:bg-accent/5'
              }`}
              onClick={isDocked ? undefined : handleStationClick}
            >
              <div 
                className={`w-24 h-24 rounded-full border border-dashed transition-all duration-500 ${
                  isDocked 
                    ? 'border-accent/80 shadow-[0_0_20px_var(--accent)]' 
                    : 'border-accent/30'
                }`}
                style={{ animation: 'spin 15s linear infinite' }}
              />
              <div className={`absolute bottom-3 text-[9px] font-mono tracking-tighter uppercase transition-all duration-500 ${
                isDocked ? 'text-accent' : 'text-accent/40'
              }`}>
                {isDocked ? 'Orb_Docked' : 'Click_To_Dock_Orb'}
              </div>
              
              {/* Undock button when docked */}
              {isDocked && (
                <button
                  onClick={handleUndock}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent/20 hover:bg-accent/40 text-accent hover:text-white transition-all duration-200 flex items-center justify-center text-xs font-bold"
                  title="Release Orb (ESC)"
                >
                  ✕
                </button>
              )}
            </div>

            {/* REMARKS BOX - Only show if docked and description should be shown */}
            {isDocked && showDescription && (
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentIndex}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="mt-6 p-4 rounded-lg bg-accent/[0.03] dark:bg-accent/5 border border-accent/10 overflow-hidden shadow-inner"
                  >
                    <div className="flex items-center justify-between border-b border-accent/10 pb-2">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Description:</span>
                      {canSkip && (
                        <button
                          onClick={skipTyping}
                          className="text-[8px] text-accent/60 hover:text-accent uppercase tracking-wider transition-colors"
                        >
                          Skip
                        </button>
                      )}
                    </div>
                    <p className="text-app-text/70 font-mono text-xs leading-relaxed italic mt-2">
                      {typedText}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: THE DECK --- */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="w-full aspect-video rounded-2xl border border-accent/20 bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden flex flex-col relative shadow-2xl shadow-accent/5"
              >
                <div className="flex-1 relative overflow-hidden bg-black/5 dark:bg-white/5">
                  <motion.div
                    key={`img-${currentIndex}`}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${projects[currentIndex]?.img})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      filter: isDocked ? 'grayscale(0%)' : 'grayscale(100%)',
                      transition: 'filter 2s ease-in-out'
                    }}
                  />
                  
                  {/* Overlay to make text readable in Light Mode */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 dark:to-black/80" />

                  {isDocked && (
                    <div 
                      className="absolute left-0 w-full h-[2px] bg-accent/60 shadow-[0_0_15px_var(--accent)] z-20 animate-scan-once"
                      style={{ 
                        top: '0%',
                        animation: 'scanOnce 2s ease-in-out forwards'
                      }}
                    />
                  )}
                </div>

                <div className="p-8 relative z-30">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-3 drop-shadow-md">
                        {projects[currentIndex]?.title}
                      </h3>
                      <div className="flex gap-2">
                        {projects[currentIndex]?.techStack?.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 border border-accent/40 bg-black/20 text-accent font-mono text-[9px] uppercase tracking-tighter backdrop-blur-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-7xl font-black text-accent/20 select-none leading-none">
                      0{currentIndex + 1}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-px mt-6 bg-accent/20 p-[1px] rounded-lg overflow-hidden shadow-lg">
              <button 
                onClick={prevProject}
                className="flex-1 py-4 bg-app-bg hover:bg-accent/10 text-app-text font-mono text-[10px] tracking-[0.2em] transition-all uppercase"
              >
                Prev_Mod
              </button>
              <button 
                onClick={nextProject}
                className="flex-1 py-4 bg-app-bg hover:bg-accent/10 text-app-text font-mono text-[10px] tracking-[0.2em] transition-all uppercase"
              >
                Next_Mod
              </button>

              {projects[currentIndex].url && (
                <a href={projects[currentIndex]?.url} target='_blank' rel="noreferrer" className="flex-[0.5]">
                  <button className="w-full h-full py-4 cursor-pointer bg-accent text-white dark:text-app-bg font-black text-[10px] tracking-[0.2em] hover:brightness-110 transition-all uppercase">
                    Access_Live
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.2; }
          50% { top: 100%; opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scanOnce {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </section>
  );
};

export default Projects;
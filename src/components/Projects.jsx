import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data to ensure it renders even if your external data is missing
const fallbackProjects = [
  { 
    title: "NEURAL INTERFACE", 
    techStack: ["REACT", "FRAMER"], 
    remarks: "System stable. User interface showing 98% efficiency in neural-link tests. Ready for deployment." 
  },
  { 
    title: "QUANTUM VAULT", 
    techStack: ["NODE", "REDIS"], 
    remarks: "Security protocols active. Encryption layers successfully bypassed. Data integrity confirmed." 
  }
];

const Projects = ({ projects = fallbackProjects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
  const prevProject = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <section id="projects" className="relative min-h-screen bg-app-bg flex items-center justify-center py-24 px-6 overflow-hidden text-app-text">
      
      {/* 2-Column Grid Container */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch z-10">
        
        {/* --- LEFT COLUMN: THE STATION --- */}
        <div className="lg:col-span-4 flex flex-col justify-center gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
              Project <br />
              <span className="text-accent">Missions</span>
            </h2>
            <div className="h-1 w-12 bg-accent mt-4" />
          </div>

          {/* STATION HUB */}
          <div className="relative mt-4 border-l-2 border-accent/20 pl-6 py-2 bg-gradient-to-r from-accent/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase opacity-70">Station_Alpha_01</span>
            </div>

            {/* ORB DOCKING POINT */}
            <div 
              id="project-station" 
              className="w-full h-44 rounded-xl border border-accent/10 bg-black/30 flex items-center justify-center relative overflow-hidden"
            >
              {/* Spinning visual aid */}
              <div 
                className="w-24 h-24 rounded-full border border-accent/20 border-dashed"
                style={{ animation: 'spin 10s linear infinite' }}
              />
              <div className="absolute bottom-3 text-[9px] font-mono text-accent/30 tracking-tighter uppercase">
                Awaiting_Orb_Docking...
              </div>
            </div>

            {/* REMARKS BOX (Rolls out) */}
            <motion.div 
              key={currentIndex}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/10 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2 border-b border-accent/10 pb-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Orb_Remarks:</span>
              </div>
              <p className="text-app-text/70 font-mono text-xs leading-relaxed italic">
                {projects[currentIndex]?.remarks || "Diagnostic complete. No anomalies detected in current module."}
              </p>
            </motion.div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: THE DECK --- */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.02, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full aspect-video rounded-2xl border border-accent/20 bg-black/40 backdrop-blur-sm overflow-hidden flex flex-col relative shadow-2xl"
              >
                {/* Image / Viewport Placeholder */}
                <div className="flex-1 bg-accent/5 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                  />
                  {/* Laser Scan Line */}
                  <div 
                    className="absolute left-0 w-full h-[2px] bg-accent/40 shadow-[0_0_15px_var(--accent)]"
                    style={{ animation: 'scan 4s ease-in-out infinite' }}
                  />
                </div>

                {/* Info Footer */}
                <div className="p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black text-app-text uppercase tracking-tight mb-3">
                        {projects[currentIndex]?.title}
                      </h3>
                      <div className="flex gap-2">
                        {projects[currentIndex]?.techStack?.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 border border-accent/20 text-accent font-mono text-[9px] uppercase tracking-tighter">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-7xl font-black text-accent/5 select-none leading-none">
                      0{currentIndex + 1}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Deck Navigation */}
            <div className="flex gap-px mt-6 bg-accent/20 p-[1px] rounded-lg overflow-hidden">
              <button 
                onClick={prevProject}
                className="flex-1 py-4 bg-app-bg hover:bg-accent/10 text-accent font-mono text-[10px] tracking-[0.2em] transition-all uppercase"
              >
                Prev_Mod
              </button>
              <button 
                onClick={nextProject}
                className="flex-1 py-4 bg-app-bg hover:bg-accent/10 text-accent font-mono text-[10px] tracking-[0.2em] transition-all uppercase"
              >
                Next_Mod
              </button>
              <button className="px-10 py-4 bg-accent text-app-bg font-black text-[10px] tracking-[0.2em] hover:brightness-110 transition-all uppercase">
                Access_Live
              </button>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </section>
  );
};

export default Projects;
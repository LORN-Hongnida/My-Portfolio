import React, { useRef } from 'react';
import { heroData } from '../data/data';
import OrbTrigger from './OrbTrigger';
import CVGenerator from '../features/cvgenerator/CVGenerator';

const Hero = ({ orbStatus, onOrbToggle }) => { // Added onOrbToggle prop
  const cvRef = useRef();

  const handleDownloadClick = () => {
    window.dispatchEvent(new CustomEvent('orb-say', { 
        detail: "COMPILING_ENCRYPTED_PDF..." 
    }));

    if (cvRef.current) {
      cvRef.current.handlePrint();
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-32 pt-24 overflow-hidden bg-app-bg transition-colors duration-500">
      {/* Background Blurs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 blur-[120px] rounded-full"></div>
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-indigo-400/10 blur-[120px] rounded-full"></div>

      {/* LEFT SIDE: Content */}
      <div className="flex-1 z-10 space-y-6 mt-10 md:mt-0">
        <div className="space-y-4">
          <OrbTrigger comment="System initialized. Greetings, user." orbStatus={orbStatus}>
            <h2 className="text-accent font-mono tracking-widest text-sm md:text-base cursor-default">
              {heroData.greetings}
            </h2>
          </OrbTrigger>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-app-text leading-tight">
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
              {heroData.name}
            </span>
          </h1>
          
          <h3 className="text-2xl md:text-4xl font-semibold text-app-text/80 tracking-tight">
            {heroData.titles.join(" • ")}
          </h3>
          
          <p className="text-app-text/60 text-lg max-w-lg leading-relaxed font-light">
            {heroData.bio}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-row items-center justify-start gap-4 pt-4">
            <OrbTrigger comment="Initiating sequence to view archives..." orbStatus={orbStatus}>
                <button className="px-8 py-3 bg-accent text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-accent/20 whitespace-nowrap"
                onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
                >
                {heroData.buttons.primary.text}
                </button>
            </OrbTrigger>

            <OrbTrigger comment="Establishing communication channel..." orbStatus={orbStatus}>
                <button className="px-8 py-3 border border-app-text/20 text-app-text font-semibold rounded-full hover:bg-app-text/5 transition-colors whitespace-nowrap" onClick={handleDownloadClick}>
                {heroData.buttons.secondary.text}
                </button>
            </OrbTrigger>
        </div>
      </div>

      {/* RIGHT SIDE: Profile Image */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative">
          <OrbTrigger comment={heroData.heroRemark} orbStatus={orbStatus}>
            <div className="relative group cursor-help">
              <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping opacity-20"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-accent/20 overflow-hidden shadow-2xl bg-[#1a1a2e]">
                <img 
                  src={heroData.profileImg} 
                  alt={heroData.name} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
                />
              </div>
            </div>
          </OrbTrigger>
        </div>
      </div>
      
      {/* Pedestal Section - The Docking Station */}
      <div className="absolute top-10 right-5 w-[400px] h-[300px] flex items-center justify-center pointer-events-none" style={{ perspective: "1000px" }}>    
          <div className="absolute bottom-30 w-48 h-20 bg-accent/30 blur-3xl rounded-full" style={{ transform: 'rotateX(75deg)' }}></div>
          <div className="absolute w-[50%] h-24 border-[3px] border-accent/30 rounded-[100%] shadow-[0_0_20px_accent]" style={{ transform: "rotateX(75deg)" }}></div>
          <div className="absolute w-[30%] h-20 border-[3px] border-accent/30 rounded-[100%] shadow-[0_0_20px_accent]" style={{ transform: "rotateX(75deg)" }}></div>
          
          {/* ACTUALLY CLICKABLE AREA */}
          <div 
            id="hero-pedestal" 
            onClick={onOrbToggle} // <--- TRiggers the Toggle logic
            className="relative w-16 h-16 flex items-center justify-center pointer-events-auto cursor-pointer group"
          >
              <div className="absolute -bottom-2 w-12 h-12 bg-accent/60 blur-xl rounded-full group-hover:bg-accent transition-colors"></div>
              {/* Optional label for the pedestal */}
              <span className="absolute -top-8 font-mono text-[8px] text-accent opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {orbStatus === 'sleeping' ? '[ INITIALIZE_ORB ]' : '[ DEACTIVATE_SYSTEM ]'}
              </span>
          </div>
      </div>
      <CVGenerator ref={cvRef} />
    </section>
  );
};

export default Hero;
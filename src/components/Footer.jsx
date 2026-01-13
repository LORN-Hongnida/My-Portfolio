import React from 'react';
import { Github, Instagram, Mail } from 'lucide-react'; // npm install lucide-react

const Footer = () => {
  return (
    <footer className="py-12 px-10 md:px-32 border-t border-white/5 bg-app-bg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Copyright */}
        <div className="font-mono text-[10px] text-app-text/40 tracking-[0.3em] uppercase order-2 md:order-1">
          © 2026 // Hongnida Lorn // Portfolio v1.0
        </div>
        
        {/* Center: Social Icons */}
        <div className="flex gap-8 items-center order-1 md:order-2">
          <a 
            href="https://github.com/LORN-Hongnida" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-app-text/60 hover:text-accent transition-all duration-300 hover:scale-110"
          >
            <Github size={18} strokeWidth={1.5} />
          </a>
          <a 
            href="mailto:nda403364@gmail.com" 
            className="text-app-text/60 hover:text-accent transition-all duration-300 hover:scale-110"
          >
            <Mail size={18} strokeWidth={1.5} />
          </a>
          <a 
            href="https://instagram.com/lornhongnida" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-app-text/60 hover:text-accent transition-all duration-300 hover:scale-110"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </div>

        {/* Right: System Status */}
        <div className="flex items-center gap-2 order-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="font-mono text-[9px] text-app-text/40 uppercase tracking-tighter">System_Online</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
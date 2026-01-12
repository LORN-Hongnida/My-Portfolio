import React, { useState } from 'react';
import { aboutData } from '../data/data';
import AboutCard from './AboutCard';
import OrbTrigger from './OrbTrigger';

const About = ({ orbStatus }) => {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <section id="about" className="relative min-h-screen w-full py-20 px-10 md:px-32 bg-app-bg overflow-hidden transition-colors duration-500">
            <div className="absolute left-20 w-96 h-96 bg-accent/10 blur-[120px] rounded-full"></div>
            
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(var(--accent-color) 1px, transparent 1px), linear-gradient(90deg, var(--accent-color) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px', 
                    opacity: 0.15
                }}>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <p className="font-mono text-accent mb-2 tracking-widest uppercase opacity-70 italic">
                    {aboutData.label}
                </p>
                <h2 className="text-5xl md:text-7xl font-bold mb-16 text-app-text tracking-tighter">
                    {aboutData.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aboutData.modules.map((module) => (
                        <OrbTrigger 
                            key={module.id} 
                            orbStatus={orbStatus}
                            onHoverChange={(isHovering) => setHoveredId(isHovering ? module.id : null)}
                        >
                            <AboutCard 
                                module={module} 
                                isHovered={hoveredId === module.id} 
                                orbStatus={orbStatus}
                            />
                        </OrbTrigger>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
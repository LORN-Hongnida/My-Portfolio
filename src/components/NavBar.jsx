import { useState, useEffect } from 'react';

const Navbar = () => {
    const [theme, setTheme] = useState(() => {
        return sessionStorage.getItem('user-theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        sessionStorage.setItem('user-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-[1000] px-10 py-5 flex justify-between items-center backdrop-blur-lg border-b border-white/10">
            {/* LOGO SECTION */}
            <div className='flex items-center gap-3 cursor-pointer group' onClick={() => scrollToSection('hero')}>
                <div className="transition-transform duration-300 group-hover:scale-110">
                    <OrbLogo size={32} />
                </div>
                <span className='font-bold tracking-tighter text-xl text-app-text uppercase'>
                    Hongnida Lorn
                </span>
            </div>

            {/* NAV LINKS */}
            <div className="flex items-center gap-8">
                <div className="hidden md:flex gap-6 text-sm font-mono uppercase tracking-widest">
                    {['home', 'about', 'skills', 'projects', 'contact'].map((item) => (
                        <a 
                            key={item}
                            href={`#${item}`} 
                            onClick={(e) => { 
                                e.preventDefault(); 
                                scrollToSection(item === 'home' ? 'hero' : item); 
                            }} 
                            className="text-app-text/60 hover:text-accent transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>
                
                <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-accent/50 transition-all text-lg"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    );
};

// Internal Helper for the Logo
const OrbLogo = ({ size = 30 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="navGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <circle cx="16" cy="16" r="15" fill="url(#navGlow)" />
        <circle cx="16" cy="16" r="9" fill="var(--accent-color)" style={{ filter: 'url(#softGlow)' }} />
        <circle cx="13" cy="15" r="1.2" fill="#0b0b1a" />
        <circle cx="19" cy="15" r="1.2" fill="#0b0b1a" />
    </svg>
);

export default Navbar;
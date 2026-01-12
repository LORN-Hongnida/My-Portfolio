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

    return (
        <nav className="fixed top-0 left-0 w-full z-[1000] px-10 py-5 flex justify-between items-center  backdrop-blur-lg border-b border-white/10">
            <div className='flex items-center gap-2 cursor-pointer'>
                <svg width="30" height="30" viewBox='0 0 100 100' className='fill-indigo-400'>
                    <path d='M50 5 L70 30 L50 55 L30 30 Z M50 95 L30 70 L50 45 L70 70 Z'/>
                    <circle cx='50' cy='50' r='10' fill='fill-white' />
                </svg>
                <span className='font-bold tracking-tighter text-xl text-app-text'>PORTFOLIO</span>
            </div>

            <div className="flex items-center gap-8">
    <div className="flex gap-6 text-sm font-medium">
      {/* Dynamic text color for light/dark mode */}
      <a href="#work" className="text-app-text/70 hover:text-app-text">Work</a>
      <a href="#about" className="text-app-text/70 hover:text-app-text">About</a>
    </div>
    <button onClick={toggleTheme} className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</button>
  </div>
        </nav>
    );
};

export default Navbar;
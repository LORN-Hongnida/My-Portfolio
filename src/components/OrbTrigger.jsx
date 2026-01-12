import React from 'react';

const OrbTrigger = ({ children, comment, orbStatus, onHoverChange }) => {
    const handleMouseEnter = () => {
        if (onHoverChange) onHoverChange(true);
        if (orbStatus !== 'sleeping' && comment) {
        const event = new CustomEvent('orb-say', { detail: comment });
        window.dispatchEvent(event);
        }
    };

    const handleMouseLeave = () => {
        if (onHoverChange) onHoverChange(false);
        const event = new CustomEvent('orb-say', { detail: "" });
        window.dispatchEvent(event);
    };

    return (
        <div 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            className="h-full"
        >
        {children}
        </div>
    );
};

export default OrbTrigger;
import React, { useState, useEffect } from 'react';

const DecryptText = ({ text, active }) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = '!<>-_\\/[]{}—=+*^?#________';

    useEffect(() => {
        if (!active) {
            setDisplayText(text);
            return;
        }

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev => 
                text.split("").map((letter, index) => {
                    if (index < iteration) return text[index];
                    if (text[index] === " ") return " ";
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [active, text]);

    return <span>{displayText}</span>;
};

export default DecryptText;
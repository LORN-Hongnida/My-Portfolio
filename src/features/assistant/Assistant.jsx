import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import "./Assistant.css";

const Assistant = ({ onStatusChange }) => {
    const [status, setStatus] = useState("sleeping");
    const [message, setMessage] = useState("Click to wake me up.");
    const [isWaking, setIsWaking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const [isGlitching, setIsGlitching] = useState(true);

    const messageTimerRef = useRef(null);
    // Initialize at 0, but we keep it hidden until the first sync
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 100 };
    const orbX = useSpring(mouseX, springConfig);
    const orbY = useSpring(mouseY, springConfig);

    // Assistant.jsx updates
    const [isDocked, setIsDocked] = useState(false);

    useEffect(() => {
        const handleDock = (e) => setIsDocked(e.detail);
        window.addEventListener('orb-dock', handleDock);
        return () => window.removeEventListener('orb-dock', handleDock);
    }, []);

    // Update the movement useEffect:
    useEffect(() => {
        let animationFrameId;
        const syncPosition = () => {
        const dock = document.getElementById("skill-dock");
        const pedestal = document.getElementById("hero-pedestal");

        if (status !== "sleeping" && isDocked && dock) {
            // DOCKING LOGIC: Lock to dock completely - no movement allowed
            const rect = dock.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2 - 25;
            const targetY = rect.top + rect.height / 2 - 25;
            
            // Set position directly without spring animation for complete lock
            mouseX.set(targetX);
            mouseY.set(targetY);
            
            // Ensure status stays "chasing" for the animation
            if (status !== "chasing") setStatus("chasing");
            } else if (status === "sleeping" && pedestal) {
                // PEDESTAL LOGIC
                const rect = pedestal.getBoundingClientRect();
                mouseX.set(rect.left + rect.width / 2 - 25);
                mouseY.set(rect.top + rect.height / 2 - 45);
            }
            animationFrameId = requestAnimationFrame(syncPosition);
        };
        syncPosition();
        return () => cancelAnimationFrame(animationFrameId);
    }, [status, isDocked, mouseX, mouseY]);

    useEffect(() => {
        if (onStatusChange) onStatusChange(status);
    }, [status, onStatusChange]);
    
    // Listener for OrbTrigger events
    useEffect(() => {
        const handleOrbSay = (e) => {
            const newContent = e.detail;
            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);

            if (newContent === "") {
                messageTimerRef.current = setTimeout(() => setMessage(""), 1000);
            } else {
                setMessage(newContent);
                messageTimerRef.current = setTimeout(() => setMessage(""), 5000);
            }
        };

        window.addEventListener('orb-say', handleOrbSay);
        return () => {
            window.removeEventListener('orb-say', handleOrbSay);
            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        };
    }, []);

    // 1. Initial Snap: Prevent (0,0) by calculating before the first paint
    useLayoutEffect(() => {
        const updateInitialPos = () => {
            const pedestal = document.getElementById("hero-pedestal");
            if (pedestal) {
                const rect = pedestal.getBoundingClientRect();
                const targetX = rect.left + rect.width / 2 - 25;
                const targetY = rect.top + rect.height / 2 - 25;
                
                mouseX.set(targetX);
                mouseY.set(targetY);
                orbX.set(targetX);
                orbY.set(targetY);
                
                // Show the orb now that it's in the right place
                setIsVisible(true);
            }
        };

        updateInitialPos();
    }, []);

    // 2. Continuous Sync while sleeping (handles scrolling)
    useEffect(() => {
        let animationFrameId;

        const syncToPedestal = () => {
            if (status === "sleeping") {
                const pedestal = document.getElementById("hero-pedestal");
                if (pedestal) {
                    const rect = pedestal.getBoundingClientRect();
                    mouseX.set(rect.left + rect.width / 2 - 25);
                    mouseY.set(rect.top + rect.height / 2 - 45);
                }
            }
            animationFrameId = requestAnimationFrame(syncToPedestal);
        };
        
        syncToPedestal();

        return () => cancelAnimationFrame(animationFrameId);
    }, [status, mouseX, mouseY]);

    // Sync Logic
    useEffect(() => {
    let animationFrameId;
    const syncPosition = () => {
        const dock = document.getElementById("skill-dock");
        
        if (isDocked && dock) {
        const rect = dock.getBoundingClientRect();
        // Use set() immediately to prevent the "trailing" effect
        mouseX.set(rect.left + rect.width / 2 - 25);
        mouseY.set(rect.top + rect.height / 2 - 45);
        if (status !== "chasing") setStatus("chasing");
        }
        // ... rest of pedestal logic ...
        animationFrameId = requestAnimationFrame(syncPosition);
    };
    syncPosition();
    return () => cancelAnimationFrame(animationFrameId);
    }, [isDocked, status, mouseX, mouseY]);

    // 3. Glitch Timer
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setIsGlitching(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // 4. Movement Logic
    useEffect(() => {
        const handleMove = (e) => {
            // If docked, completely lock position and only update eyes
            if (isDocked) {
                const dx = e.clientX - orbX.get();
                const dy = e.clientY - orbY.get();
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 0) {
                    setEyeOffset({x: (dx/dist) * 5, y: (dy/dist) * 5})
                }
                return; // Don't allow any position changes when docked
            }

            if (status !== "sleeping") {
                const screenWidth = window.innerWidth;
                const safeMargin = 120;
                
                let targetX = e.clientX > screenWidth / 2 ? e.clientX - safeMargin : e.clientX + safeMargin;
                targetX = Math.max(20, Math.min(targetX, screenWidth - 70));
                
                mouseX.set(targetX);
                mouseY.set(e.clientY - 25);

                const dx = e.clientX - orbX.get();
                const dy = e.clientY - orbY.get();
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 10) {
                    setEyeOffset({
                        x: (dx / dist) * 4,
                        y: (dy / dist) * 4
                    });
                } else {
                    setEyeOffset({ x: 0, y: 0 });
                }

                if (dist > 600 && status !== "tired" && !isDocked) {
                    setStatus("tired");
                    setMessage("Wait For Me!!");
                    setTimeout(() => { setStatus("chasing"); setMessage(""); }, 2000);
                }
            }
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [status, orbX, orbY, mouseX, mouseY, isDocked]);

    // 5. Pedestal Click to Sleep
    useEffect(() => {
        const pedestal = document.getElementById("hero-pedestal");
        if (pedestal) {
            const handlePedestalClick = () => {
                if (status === "chasing" || status === "tired") {
                    setStatus("sleeping");
                    setMessage("Good night!");
                    setTimeout(() => setMessage(""), 2000);
                }
            };
            pedestal.addEventListener("click", handlePedestalClick);
            return () => pedestal.removeEventListener("click", handlePedestalClick);
        }
    }, [status]);

    const handleWakeUp = () => {
        if (status === "sleeping") {
            setIsWaking(true);
            setStatus("chasing");
            setMessage("Hello There! I'll be your assistant for today!✨");
            setTimeout(() => setIsWaking(false), 700);
            // Use the ref here too for consistency
            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
            messageTimerRef.current = setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <motion.div 
            className={`orb-container ${status} ${isWaking ? 'wake-up-anim' : ''}`}
            style={{ 
                x: orbX, y: orbY, 
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden',
                position: 'fixed', top: 0, left: 0,
                pointerEvents: 'auto', zIndex: 1000 
            }}
            onClick={handleWakeUp}
        >
            {message && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="speech-bubble"
                >
                    {message}
                </motion.div>
            )}

            <div className={`orb-main ${isGlitching ? 'glitch-appear' : ''}`}>
                <div className="orb-face" style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                    <div className="eye-socket">
                        <div className="eye left"></div>
                        <div className="eye right"></div>
                    </div>
                    <div className="mouth"></div>
                </div>
            </div>
            <div className="orb-glow"></div>
        </motion.div>
    );
};

export default Assistant;
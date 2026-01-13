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
    const [isDocked, setIsDocked] = useState(false);
    const [dockTarget, setDockTarget] = useState(null); 
    const [projectSequenceStep, setProjectSequenceStep] = useState(0);

    const messageTimerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 100 };
    const orbX = useSpring(mouseX, springConfig);
    const orbY = useSpring(mouseY, springConfig);

    const STATION_CONFIGS = {
        'project-station': { yOffset: -25, forceStatus: "chasing" },
        'skill-dock': { yOffset: -45, forceStatus: "chasing" },
        'hero-pedestal': { yOffset: -45, forceStatus: "sleeping" }
    };

    const PROJECT_STEP_TARGETS = {
        2: '.aspect-video',
        3: '.aspect-video', 
        4: '.mt-6.p-4',    
        5: '.mt-6.p-4'     
    };

    // --- 1. CORE TOGGLE LOGIC ---
    const handleOrbToggle = () => {
        // Clear any existing timers regardless of direction
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);

        if (status === "sleeping") {
            setIsWaking(true);
            setStatus("chasing");
            setMessage("Systems Online ✨");
            
            // Clear message after 3 seconds
            messageTimerRef.current = setTimeout(() => setMessage(""), 3000);
            setTimeout(() => setIsWaking(false), 700);
        } else {
            // GO BACK TO SLEEP
            setStatus("sleeping");
            setIsDocked(false);
            setDockTarget(null);
            setMessage("Click to wake me up.");
            // Do NOT set a timeout here, let it remain constant
        }
    };

    // --- 2. EVENT LISTENERS ---
    useEffect(() => {
        const handleDock = (e) => {
            if (status === "sleeping") return;
            const targetId = e.detail.target || "skill-dock";
            const isActivating = e.detail.active;

            if (isActivating && isDocked && dockTarget !== targetId) {
                window.dispatchEvent(new CustomEvent('orb-dock', { 
                    detail: { target: dockTarget, active: false } 
                }));
            }
            setIsDocked(isActivating);
            setDockTarget(isActivating ? targetId : null);
            setProjectSequenceStep(isActivating && targetId === 'project-station' ? 1 : 0);
        };

        const handleOrbSay = (e) => {
            // Do not allow external messages to override the sleep message
            if (status === "sleeping") return;

            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
            setMessage(e.detail);
            if (e.detail !== "") {
                messageTimerRef.current = setTimeout(() => setMessage(""), 5000);
            }
        };

        const handleExternalToggle = () => handleOrbToggle();

        window.addEventListener('orb-dock', handleDock);
        window.addEventListener('orb-say', handleOrbSay);
        window.addEventListener('orb-toggle', handleExternalToggle);
        
        return () => {
            window.removeEventListener('orb-dock', handleDock);
            window.removeEventListener('orb-say', handleOrbSay);
            window.removeEventListener('orb-toggle', handleExternalToggle);
        };
    }, [status, isDocked, dockTarget]);

    // --- 3. POSITION & STATUS SYNC ---
    useEffect(() => {
        let animationFrameId;
        const syncPosition = () => {
            let activeId = null;
            
            // Priority 1: If we are sleeping, stick to pedestal
            // Priority 2: If we are awake and docked, go to dock
            if (status === "sleeping") {
                activeId = "hero-pedestal";
            } else if (isDocked && dockTarget) {
                activeId = dockTarget;
            }

            const targetEl = activeId ? document.getElementById(activeId) : null;

            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                const config = STATION_CONFIGS[activeId] || { yOffset: -25 };
                
                mouseX.set(rect.left + rect.width / 2 - 25);
                mouseY.set(rect.top + rect.height / 2 + config.yOffset);
                
                // Only force "chasing" status for skill/project docks if awake
                if (config.forceStatus === "chasing" && status !== "chasing") {
                    setStatus("chasing");
                }
            }
            animationFrameId = requestAnimationFrame(syncPosition);
        };
        syncPosition();
        return () => cancelAnimationFrame(animationFrameId);
    }, [status, isDocked, dockTarget]);

    // --- 4. PROJECT SEQUENCE & EYE TRACKING ---
    useEffect(() => {
        if (isDocked && dockTarget === 'project-station' && projectSequenceStep > 0) {
            const timers = {
                1: { next: 2, time: 300 },
                2: { next: 3, time: 600 },
                3: { next: 4, time: 2000 },
                4: { next: 5, time: 500, action: () => window.dispatchEvent(new CustomEvent('show-project-description')) } 
            };
            const current = timers[projectSequenceStep];
            if (current) {
                const t = setTimeout(() => {
                    if (current.action) current.action();
                    setProjectSequenceStep(current.next);
                }, current.time);
                return () => clearTimeout(t);
            }
        }
    }, [isDocked, dockTarget, projectSequenceStep]);

    useEffect(() => {
        const handleMove = (e) => {
            const orbPos = { x: orbX.get() + 25, y: orbY.get() + 25 };
            
            if (status === "sleeping") {
                setEyeOffset({ x: 0, y: 2 }); // Sleepy look
                return;
            }

            const dx = e.clientX - orbPos.x, dy = e.clientY - orbPos.y;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            
            if (!isDocked) {
                const screenWidth = window.innerWidth;
                const safeMargin = 120;
                let tx = e.clientX > screenWidth / 2 ? e.clientX - safeMargin : e.clientX + safeMargin;
                mouseX.set(Math.max(20, Math.min(tx, screenWidth - 70)));
                mouseY.set(e.clientY - 25);
            }
            setEyeOffset({ x: (dx/dist)*5, y: (dy/dist)*5 });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [status, isDocked, dockTarget, projectSequenceStep]);

    // --- 5. INITIAL APPEARANCE ---
    useLayoutEffect(() => {
        const pedestal = document.getElementById("hero-pedestal");
        if (pedestal) {
            const rect = pedestal.getBoundingClientRect();
            const tx = rect.left + rect.width / 2 - 25;
            const ty = rect.top + rect.height / 2 - 45;
            mouseX.set(tx); mouseY.set(ty);
            orbX.set(tx); orbY.set(ty);
            setIsVisible(true);
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setIsGlitching(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    useEffect(() => { if (onStatusChange) onStatusChange(status); }, [status]);

    return (
        <motion.div 
            className={`orb-container ${status} ${isWaking ? 'wake-up-anim' : ''}`}
            style={{ 
                x: orbX, y: orbY, opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden',
                position: 'fixed', top: 0, left: 0, zIndex: 1000 
            }}
            onClick={handleOrbToggle}
        >
            {message && (
                <motion.div 
                    key={message} 
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
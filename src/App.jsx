import React, { useState } from "react"; // Added useState import
import Assistant from "./features/assistant/Assistant.jsx";
import Navbar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import CVGenerator from "./features/cvgenerator/CVGenerator.jsx";
import Footer from "./components/Footer.jsx";
import Contact from "./components/Contact.jsx";

// for web analytics
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [orbStatus, setOrbStatus] = useState('sleeping');
  const handleOrbToggle = () => {
    window.dispatchEvent(new CustomEvent('orb-toggle'));
  };
  
  return (
    <div className="min-h-screen bg-[#0b0b1a] text-white">
      <Analytics />
      <Navbar />
      <section id="hero">
        <Hero orbStatus={orbStatus} onOrbToggle={handleOrbToggle} />
      </section>
      <section id="about">
        <About orbStatus={orbStatus}/>
      </section>
      <section id="skills">
        <Skills orbStatus={orbStatus} />
      </section>
      <section id="projects">
        <Projects orbStatus={orbStatus} />
      </section>
      <section id="contact">
        <Contact orbStatus={orbStatus} />
      </section>
      <Footer />
      <Assistant onStatusChange={setOrbStatus}/>
      <CVGenerator />
    </div>
  );
}

export default App;
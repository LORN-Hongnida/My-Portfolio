import React, { useState } from "react"; // Added useState import
import Assistant from "./features/assistant/Assistant.jsx";
import Navbar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";

function App() {
  const [orbStatus, setOrbStatus] = useState('sleeping');
  
  return (
    <div className="min-h-screen bg-[#0b0b1a] text-white">
      <Navbar />
      <Hero orbStatus={orbStatus}/>
      <About orbStatus={orbStatus}/>
      <Skills orbStatus={orbStatus} />
      <Projects orbStatus={orbStatus} />
      <Assistant onStatusChange={setOrbStatus}/>
    </div>
  );
}

export default App;
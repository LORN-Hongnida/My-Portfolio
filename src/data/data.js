import myPhoto from '../assets/image.png'

export const heroData = {
    heroRemark: "This is my favorite part of the site. Look at that glow!",
    greetings: "> HELLO, WORLD!",
    name: "Nida",
    titles: [
        "Full-Stack Developer",
        "AI Enthusiast",
        "Creative Coder"
    ],
    bio: "I build interactive digital experiences that blend clean code with intelligent design. Currently exploring the frontier of Web-AI integration.",
    profileImg: myPhoto, // Path to your photo
    buttons: {
        primary: { text: "View Projects", link: "#projects" },
        secondary: { text: "Contact Me", link: "#contact" }
    }
};


export const aboutData = {
  label: "DATA_EXTRACTION // 01",
  title: "The Human Element",
  modules: [
    {
      id: "bio",
      header: "SYSTEM_OVERWRITE",
      content: "Based in [Your Location], I am a developer who bridges the gap between complex logic and intuitive design. I don't just write code; I craft digital ecosystems.",
      remark: "I checked her core files-the logic is surprisingly human!"
    },
    {
      id: "approach",
      header: "LOGIC_PATTERN",
      content: "My approach is rooted in 'Intelligent Minimalism.' I believe the best AI integrations are the ones that feel invisible but indispensable.",
      remark: ""
    },
    {
      id: "mission",
      header: "FUTURE_GOAL",
      content: "Currently focused on building autonomous web agents and hyper-personalized user interfaces.",
      remark: ""
    }
  ]
};

export const skills = [
    {name: "React", icon: "", level: "50", info: "I'm the heart of this portfolio's interactivity!"},
    {name: "AI/LLM", icon: "", level: "25", info: "She's learning to integrate me with modern LLMs."},
    {name: "Tailwind", icon: "", level: "50", info: "Used for the sleek dark-mode styling you see here."},
    {name: "JavaScript", icon: "", level: "50", info: "The logic that powers my sentient brain!"},
    {name: "Python", icon: "", level: "25", info: "Her choice for AI and data processing."},
    {name: "Node.js", icon: "", level: "75", info: "Backend choice"},
    {name: "HTML", icon: "", level: "75", info: "Backend choice"},
    {name: "CSS", icon: "", level: "75", info: "Backend choice"}
]
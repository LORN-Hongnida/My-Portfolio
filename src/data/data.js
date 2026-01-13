import pfp from '../assets/pfp.png'
import paw from '../assets/projects/paw.png'
import pisa from '../assets/projects/pisa.png'
import portfolio from '../assets/projects/portfolio.png'
import govconnect from '../assets/projects/govconnect.png'
import recipe from '../assets/projects/recipe.png'
import py from '../assets/skills/python.png'
import js from '../assets/skills/js.png'
import tw from '../assets/skills/tw.png'
import react from '../assets/skills/react.png'
import css from '../assets/skills/css.png'
import html from '../assets/skills/html.png'
import node from '../assets/skills/node.png'
import ai from '../assets/skills/ai.png'



export const heroData = {
    heroRemark: "This is my favorite part of the site. Look at that glow!",
    greetings: "> HELLO, WORLD!",
    name: "Nida",
    titles: [
        "Web Developer",
        "UX/UI Enthusiast",
        "Exploring AI Integration"
    ],
    bio: "I build interactive digital experiences by combining clean code with thoughtful UX design. Currently exploring how AI can enhance web applications.",
    profileImg: pfp, // Path to your photo
    buttons: {
        primary: { text: "View Projects", link: "#projects" },
        secondary: { text: "Contact Me", link: "#contact" }
    }
};


export const aboutData = {
  label: "PROFILE_DATA // 01",
  title: "ABOUT ME",
  modules: [
    {
      id: "introduction",
      header: "USER_PROFILE",
      content: "I am an ICT student with a strong interest in building meaningful digital products. Through university projects, I’ve worked on web-based systems that emphasize usability, structure, and clarity. I enjoy learning by building, refining ideas through practice, and understanding how users interact with technology.",
      remark: "A solid foundation — learning by building seems to be a recurring theme."
    },
    {
      id: "approach",
      header: "WORK_STYLE",
      content: "I prefer a practical and user-focused approach to development. I start by understanding the problem, then design simple solutions before improving them step by step. I value clean code, clear communication, and continuous improvement through feedback.",
      remark: "Her workflow seems to prioritizes clarity, usability, and steady improvement"
    },
    {
      id: "interests & direction",
      header: "FOCUS_AREAS",
      content: "My current interests include web development, UX/UI design, and AI-powered features in web applications. I’m especially curious about how AI can improve usability, personalization, as well as accessibility. Going forward, I would love to continue exploring the intersection of web technology and intelligent systems.",
      remark: "Seem like curiosity drives most of the exploration here."
    }
  ]
};

export const skills = [
    {name: "React", icon: react, level: "50", info: "I'm the heart of this portfolio's interactivity!"},
    {name: "AI/LLM", icon: ai, level: "25", info: "She's learning to integrate me with modern LLMs."},
    {name: "Tailwind", icon: tw, level: "50", info: "Used for the sleek dark-mode styling you see here."},
    {name: "JavaScript", icon: js, level: "50", info: "The logic that powers my sentient brain!"},
    {name: "Python", icon: py, level: "25", info: "Her choice for AI and data processing."},
    {name: "Node.js", icon: node, level: "75", info: "Backend choice"},
    {name: "HTML", icon: html, level: "75", info: "Backend choice"},
    {name: "CSS", icon: css, level: "75", info: "Backend choice"}
]

export const fallbackProjects = [
  { 
    title: "PORTFOLIO", 
    techStack: ["REACT", "TAILWIND CSS", "FRAMER"], 
    img: portfolio,
    remarks: "Personal Portfolio Website dedicated to showcasing personal skills and background.",
    url: "https://hongnida-portfolio.vercel.app/"
  },
  { 
    title: "GOVCONNECT", 
    techStack: ["REACT", "NODE.JS", "PYTHON", "TAILWIND CSS"], 
    img: govconnect,
    remarks: "A news platform website that connects the people to the government.",
    url: ""
  },
  { 
    title: "PISA - ពិសា", 
    techStack: ["HTML", "CSS", "JS"], 
    img: pisa,
    remarks: "Website for a khmer cuisine restaurant where menu and price are available to be viewed." ,
    url: "https://htmlpreview.github.io/?https://raw.githubusercontent.com/LORN-Hongnida/WebII-Final-Project/main/menu.html"
  },
  { 
    title: "PAWSOME AND PURRFECT", 
    techStack: ["HTML", "CSS"], 
    img: paw,
    remarks: "Website for a pet adoption center.",
    url: "https://htmlpreview.github.io/?https://raw.githubusercontent.com/Julie-lou/Group3_Webproject/main/contact.html"
  },
  { 
    title: "RECIPEBUDDY", 
    techStack: ["DART", "FLUTTER"], 
    img: recipe,
    remarks: "A mobile application for browsing cooking recipe with available ingredients.",
    url: ""
  },
  
];

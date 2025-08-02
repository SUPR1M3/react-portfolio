import './App.css'
import React, { useState, useEffect } from 'react'
import Hero from './sections/Hero/Hero.jsx'
import Projects from './sections/Projects/Projects.jsx'
import Skills from './sections/Skills/Skills.jsx'
import Contact from './sections/Contact/Contact.jsx'
import Footer from './sections/Footer/Footer.jsx'
import LiquidCursor from './common/LiquidCursor.jsx'
import LiquidContainerSwitch from './sections/Hero/LiquidContainerSwitch';
import MoreNavigation from './common/MoreNavigation.jsx';
import { ResumePreviewProvider } from './common/ResumePreviewContext.jsx';
import ResumePreview from './common/ResumePreview.jsx';

function App() {
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['hero', 'skills', 'projects', 'contact'];

  useEffect(() => {
    const container = document.querySelector('.horizontal-scroll-container');
    
    const handleScroll = () => {
      if (container) {
        const scrollLeft = container.scrollLeft;
        const sectionIndex = Math.round(scrollLeft / window.innerWidth);
        setActiveSection(sectionIndex);
      }
    };

    const handleKeyPress = (e) => {
      if (container) {
        if (e.key === 'ArrowRight' && activeSection < sections.length - 1) {
          const scrollLeft = (activeSection + 1) * window.innerWidth;
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft' && activeSection > 0) {
          const scrollLeft = (activeSection - 1) * window.innerWidth;
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [activeSection, sections.length]);

  return (
    <ResumePreviewProvider>
      {/* Gooey filter for liquid effects */}
      <svg style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>
      
      {/* Fixed theme switch in top-right corner */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000 
      }}>
        <LiquidContainerSwitch />
      </div>

      <LiquidCursor />
      
      {/* Horizontal scrolling container */}
      <div className="horizontal-scroll-container">
        <section id="hero" className="horizontal-section">
          <Hero/>
        </section>
        <section id="skills" className="horizontal-section">
          <Skills/>
        </section>
        <section id="projects" className="horizontal-section">
          <Projects/>
        </section>
        <section id="contact" className="horizontal-section">
          <Contact/>
        </section>
      </div>
      
      <Footer/>
      <MoreNavigation />
      <ResumePreview />
      
      {/* Scroll indicators */}
      <div className="scroll-indicator">
        {sections.map((_, index) => (
          <div 
            key={index}
            className={`scroll-dot ${index === activeSection ? 'active' : ''}`}
          />
        ))}
      </div>
    </ResumePreviewProvider>
  )
}

export default App

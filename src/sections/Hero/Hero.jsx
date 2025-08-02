import React from 'react';
import styles from './HeroStyles.module.css';
import heroImg from '../../assets/hero-img.png';
import LinkedinLight from '../../assets/linkedin-light.svg';
import LinkedinDark from '../../assets/linkedin-dark.svg';
import TwitterLight from '../../assets/twitter-light.svg';
import TwitterDark from '../../assets/twitter-dark.svg';
import GithubLight from '../../assets/github-light.svg';
import GithubDark from '../../assets/github-dark.svg';
import { useTheme } from '../../common/ThemeContext';
import { useResumePreview } from '../../common/ResumePreviewContext';

function Hero() {
    const {theme,toggleTheme} = useTheme();
    const { 
        resumeButtonRef, 
        toggleResumePreview, 
        handleMouseEnter, 
        handleMouseLeave,
        isHovering,
        resumeClicked
    } = useResumePreview();
    //const themeIcon =(theme==='light'?sun:moon);    
    return (
        <section className={styles.container}>
            {/* Separate image container with z-index: -1 */}
            <div className={styles.heroImageContainer}>
                <img className={styles.hero} src={heroImg} alt="Profile Picture of Suraj Singh" />
            </div>
            
            <div className={styles.info}>
                <h1>Suraj<br/>Singh</h1>
                <h2>FullStack Developer</h2>
                <span>
                    <a href="https://twitter.com/" target="_blank">
                        <img src={TwitterLight} style={{opacity:theme==='light'?1:0}} alt ="Twitter icon light"/>
                        <img src={TwitterDark} style={{opacity:theme==='light'?0:1}} alt ="Twitter icon dark"/>
                    </a>
                    <a href="https://www.linkedin.com/in/suraj-singh41/" target="_blank">
                        <img src={LinkedinLight} style={{opacity:theme==='light'?1:0}} alt ="Linkedin icon light"/>
                        <img src={LinkedinDark} style={{opacity:theme==='light'?0:1}} alt ="Linkedin icon dark"/>
                    </a>
                    <a href="https://github.com/SUPR1M3" target="_blank">
                        <img src={GithubLight} style={{opacity:theme==='light'?1:0}} alt ="Github icon light"/>
                        <img src={GithubDark} style={{opacity:theme==='light'?0:1}} alt ="Github icon dark"/>
                    </a>
                </span>
                <p className={styles.description}>With a passion for building web apps and internal tools for commercial businesses from scratch.</p>
                <div 
                    ref={resumeButtonRef}
                    className={styles.resumeButtonContainer}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div 
                        className={styles.button}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleResumePreview();
                        }}
                    >
                        <div className={styles.gradientContainer}>
                            <div className={styles.gradient}></div>
                        </div>
                        <div className={styles.label}>Resume</div>
                    </div>
                    
                    {/* Hover hint text */}
                    {isHovering && !resumeClicked && (
                        <div className={styles.hoverHint}>
                            Click to keep open
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Hero
import React from 'react';
import styles from './HeroStyles.module.css';
import heroImg from '../../assets/hero-img.png';
import LinkedinLight from '../../assets/linkedin-light.svg';
import LinkedinDark from '../../assets/linkedin-dark.svg';
import TwitterLight from '../../assets/twitter-light.svg';
import TwitterDark from '../../assets/twitter-dark.svg';
import GithubLight from '../../assets/github-light.svg';
import GithubDark from '../../assets/github-dark.svg';
import CV from '../../assets/Resume_Suraj_Singh.pdf';
import { useTheme } from '../../common/ThemeContext';
import LDSwitch from './LDSwitch';

function Hero() {
    const {theme,toggleTheme} = useTheme();
    //const themeIcon =(theme==='light'?sun:moon);    
    return (
        <section id="hero" className={styles.container}>
            <div className={styles.colorModeContainer}>
                <img className={styles.hero} src={heroImg} alt="Profile Picture of Suraj Singh" />
                <LDSwitch/>
            </div>
            <div className={styles.info}>
                <h1>Suraj<br/>Singh</h1>
                <h2>FullStack Developer</h2>
                <span>
                    <a href="https://twitter.com/" target="_blank">
                        <img src={TwitterLight} style={{opacity:theme==='light'?1:0,zIndex:theme==='light'?1:0}} alt ="Twitter icon light"/>
                        <img src={TwitterDark} style={{opacity:theme==='light'?0:1,zIndex:theme==='light'?0:1}} alt ="Twitter icon dark"/>
                    </a>
                    <a href="https://www.linkedin.com/in/suraj-singh41/" target="_blank">
                        <img src={LinkedinLight} style={{opacity:theme==='light'?1:0,zIndex:theme==='light'?1:0}} alt ="Linkedin icon light"/>
                        <img src={LinkedinDark} style={{opacity:theme==='light'?0:1,zIndex:theme==='light'?0:1}} alt ="Linkedin icon dark"/>
                    </a>
                    <a href="https://github.com/SUPR1M3" target="_blank">
                        <img src={GithubLight} style={{opacity:theme==='light'?1:0,zIndex:theme==='light'?1:0}} alt ="Github icon light"/>
                        <img src={GithubDark} style={{opacity:theme==='light'?0:1,zIndex:theme==='light'?0:1}} alt ="Github icon dark"/>
                    </a>
                </span>
                <p className={styles.description}>With a passion for building web apps and internal tools for commercial businesses from scratch.</p>
                <a href={CV}>
                    <button className='hover' download>Resume</button>
                </a>
            </div>
        </section>
    )
}

export default Hero
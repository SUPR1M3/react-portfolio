import React from 'react';
import styles from './MobileLandingStyles.module.css';
import heroImg from '../../assets/hero-img.webp';
import LinkedinLight from '../../assets/linkedin-light.svg';
import LinkedinDark from '../../assets/linkedin-dark.svg';
import TwitterLight from '../../assets/twitter-light.svg';
import TwitterDark from '../../assets/twitter-dark.svg';
import GithubLight from '../../assets/github-light.svg';
import GithubDark from '../../assets/github-dark.svg';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import CV from '../../assets/Suraj_Singh_Resume_Final.pdf';
import { useTheme } from '../../common/ThemeContext';
import Contact from '../Contact/Contact';
import Footer from '../Footer/Footer';

// Minimal, static landing page for phones/small tablets. Deliberately skips
// the desktop tree's heavier pieces (LiquidCursor, the 3D Skills carousel,
// the Projects marquee wall, the MoreNavigation radial menu, and
// LiquidContainerSwitch's water animation) rather than trying to reflow
// them for touch/small screens - see App.jsx's useIsMobile() branch.
function MobileLanding() {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className={styles.page}>
            <button
                type="button"
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            >
                <img src={isLight ? moon : sun} alt="" />
            </button>

            <section className={styles.hero}>
                <img
                    className={styles.photo}
                    src={heroImg}
                    alt="Profile Picture of Suraj Singh"
                />
                <h1 className={styles.name}>Suraj Singh</h1>
                <h2 className={styles.title}>FullStack Developer</h2>
                <p className={styles.bio}>
                    that enjoys building reliable AI systems while exploring the research
                    questions behind them.
                </p>

                <div className={styles.socials}>
                    <a
                        href="https://x.com/SurajS041"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter / X"
                    >
                        <img src={isLight ? TwitterLight : TwitterDark} alt="" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/suraj-singh41/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <img src={isLight ? LinkedinLight : LinkedinDark} alt="" />
                    </a>
                    <a
                        href="https://github.com/SUPR1M3"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <img src={isLight ? GithubLight : GithubDark} alt="" />
                    </a>
                </div>

                <a className={styles.resumeButton} href={CV} download="Suraj_Singh_Resume.pdf">
                    Download Resume
                </a>
            </section>

            <section className={styles.contactSection}>
                <Contact />
            </section>

            <Footer />
        </div>
    );
}

export default MobileLanding;

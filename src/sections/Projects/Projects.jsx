import React, { useMemo } from 'react';
import styles from './ProjectsStyles.module.css';
import covfefe from '../../assets/Covfefe.png';
import PortFolio from '../../assets/Favicon.png';
import BookLetter from '../../assets/BookLetterIcon.png';
import SpaceInvaders from '../../assets/SpaceShip.png';
import ReelGood from '../../assets/ReelGoodIcon.png';
import PacManRL from '../../assets/PacManRLIcon.png';
import LinkBot from '../../assets/LinkBotIcon.png';
import RocketCanvas from '../../assets/RocketCanvasIcon.png';
import Transformer from '../../assets/transformer-icon.png'
import Agent from '../../assets/agent-icon.png'

function Projects() {
    // Helper function to convert hex to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    };

    const baseProjects = useMemo(() => ([
        { 
            name: "Covfefe", 
            description: "Zomato for Cafes", 
            category: "Web App",
            link: "https://github.com/SUPR1M3/Covfefe", 
            icon: covfefe, 
            color: "#8B4513", 
            colorRgb: hexToRgb("#8B4513"),
            tech: "React, Node.js, MongoDB"
        },
        { 
            name: "BookLetter", 
            description: "Library Database Management System", 
            category: "Database App",
            link: "https://github.com/SUPR1M3/BookLetter", 
            icon: BookLetter, 
            color: "#2E8B57", 
            colorRgb: hexToRgb("#2E8B57"),
            tech: "MySQL, Express, React"
        },
        { 
            name: "Space Invaders", 
            description: "Classic Arcade Video Game", 
            category: "Game",
            link: "https://github.com/SUPR1M3/Space-Invaders", 
            icon: SpaceInvaders, 
            color: "#4169E1", 
            colorRgb: hexToRgb("#4169E1"),
            tech: "JavaScript, HTML5 Canvas"
        },
        { 
            name: "Reel Good", 
            description: "IMDB Clone for Movie Reviews", 
            category: "Web App",
            link: "https://github.com/SUPR1M3/Reel-Good", 
            icon: ReelGood, 
            color: "#DC143C", 
            colorRgb: hexToRgb("#DC143C"),
            tech: "React, API Integration"
        },
        { 
            name: "Portfolio", 
            description: "Professional Portfolio Website", 
            category: "Website",
            link: "https://github.com/SUPR1M3/react-portfolio", 
            icon: PortFolio, 
            color: "#9932CC", 
            colorRgb: hexToRgb("#9932CC"),
            tech: "React, CSS Modules, Vite"
        },
        { 
            name: "LinkBot", 
            description: "LinkedIn Outreach Automation Bot", 
            category: "Automation Tool",
            link: "https://github.com/SUPR1M3/OutReach-Bot", 
            icon: LinkBot, 
            color: "#0077B5", 
            colorRgb: hexToRgb("#0077B5"),
            tech: "Python, Selenium, Automation"
        },
        { 
            name: "RocketCanvas", 
            description: "Real-time Collaborative Canvas Design Editor", 
            category: "Web App",
            link: "https://github.com/SUPR1M3/RocketiumTest", 
            icon: RocketCanvas, 
            color: "#FF6B35", 
            colorRgb: hexToRgb("#FF6B35"),
            tech: "React, Redux, Fabric.js, Socket.io, MongoDB"
        },
        { 
            name: "PacManRL", 
            description: "Reinforcement Learning Pac-Man Agent", 
            category: "AI/ML",
            link: "https://github.com/SUPR1M3/Pacman_RL_with_feedback-master", 
            icon: PacManRL, 
            color: "#FFD700", 
            colorRgb: hexToRgb("#FFD700"),
            tech: "Python, Q-Learning, Function Approximation"
        },
        { 
            name: "Base Transformer", 
            description: "From-scratch implementation of a Transformer encoder-decoder stack.", 
            category: "AI/ML",
            link: "https://github.com/SUPR1M3/base-transformer", 
            icon: Transformer, 
            color: "#4B0082", 
            colorRgb: hexToRgb("#4B0082"),
            tech: "Python, PyTorch, Attention, Positional Encoding"
        },
        { 
            name: "Python Coding Agent", 
            description: "Autonomous Python coding assistant with tool-use.", 
            category: "Agent",
            link: "https://github.com/SUPR1M3/python-coding-agent", 
            icon: Agent, 
            color: "#20B2AA", 
            colorRgb: hexToRgb("#20B2AA"),
            tech: "Python, LLMs, Agents, Orchestration"
        },
    ]), []);

    // Build a repeated list so the wall feels dense and can loop.
    const wallProjects = useMemo(() => {
        const repeats = 3;
        const items = [];
        for (let copy = 0; copy < repeats; copy += 1) {
            baseProjects.forEach((project, index) => {
                items.push({
                    ...project,
                    _wallId: `${copy}-${project.name}-${index}`,
                });
            });
        }
        return items;
    }, [baseProjects]);

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Projects</h1>

            <div className={styles.wallWrapper}>
                <div className={styles.wallViewport}>
                    <div className={styles.wallTrack}>
                        {wallProjects.map((project) => (
                            <article
                                key={project._wallId}
                                className={styles.projectCard}
                                style={{
                                    '--project-color': project.color,
                                    '--project-color-rgb': project.colorRgb,
                                }}
                            >
                                <div
                                    className={styles.cardGlow}
                                    style={{ backgroundColor: project.color }}
                                />
                                <div className={styles.cardFront}>
                                    <div className={styles.cardImage}>
                                        <img src={project.icon} alt={project.name} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{project.name}</h3>
                                    <p className={styles.cardCategory}>{project.category}</p>
                                    <p className={styles.cardDescription}>
                                        {project.description}
                                    </p>
                                    <div className={styles.techStack}>
                                        <span className={styles.techLabel}>Tech:</span>
                                        <span className={styles.techText}>{project.tech}</span>
                                    </div>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.projectLink}
                                    >
                                        View Project →
                                    </a>
                                </div>
                            </article>
                        ))}
                        {/* Duplicate for seamless looping */}
                        {wallProjects.map((project, i) => (
                            <article
                                key={`${project._wallId}-dup-${i}`}
                                className={styles.projectCard}
                                style={{
                                    '--project-color': project.color,
                                    '--project-color-rgb': project.colorRgb,
                                }}
                            >
                                <div
                                    className={styles.cardGlow}
                                    style={{ backgroundColor: project.color }}
                                />
                                <div className={styles.cardFront}>
                                    <div className={styles.cardImage}>
                                        <img src={project.icon} alt={project.name} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{project.name}</h3>
                                    <p className={styles.cardCategory}>{project.category}</p>
                                    <p className={styles.cardDescription}>
                                        {project.description}
                                    </p>
                                    <div className={styles.techStack}>
                                        <span className={styles.techLabel}>Tech:</span>
                                        <span className={styles.techText}>{project.tech}</span>
                                    </div>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.projectLink}
                                    >
                                        View Project →
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Projects;
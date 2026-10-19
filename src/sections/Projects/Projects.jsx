import React, { useMemo } from 'react';
import styles from './ProjectsStyles.module.css';
import PortFolio from '../../assets/Favicon.png';
import BookLetter from '../../assets/BookLetterIcon.webp';
import SpaceInvaders from '../../assets/SpaceShip.webp';
import ReelGood from '../../assets/ReelGoodIcon.webp';
import PacManRL from '../../assets/PacManRLIcon.png';
import LinkBot from '../../assets/LinkBotIcon.png';
import RocketCanvas from '../../assets/RocketCanvasIcon.png';
import Transformer from '../../assets/transformer-icon.png'
import Agent from '../../assets/agent-icon.png'
import TenMTransformer from '../../assets/10m-transformer-icon.svg'
import AlphaEvolve from '../../assets/alphaevolve-icon.svg'
import PPOJax from '../../assets/ppo-jax-icon.svg'

function Projects({ isActive = true }) {
    // Helper function to convert hex to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    };

    const baseProjects = useMemo(() => ([
        { 
            name: "Base Transformer", 
            description: "Implementation of a Transformer encoder-decoder stack.", 
            category: "AI/ML",
            link: "https://github.com/SUPR1M3/Transformer_one", 
            icon: Transformer, 
            color: "#4B0082", 
            colorRgb: hexToRgb("#4B0082"),
            tech: "Python, PyTorch"
        },
        { 
            name: "10M Transformer", 
            description: "Scaling transformers up to 10M params to learn multi-digit addition.", 
            category: "AI/ML",
            link: "https://github.com/SUPR1M3/10M-Transformer", 
            icon: TenMTransformer, 
            color: "#E91E63", 
            colorRgb: hexToRgb("#E91E63"),
            tech: "Python, Jax, Flax, Optax"
        },
        { 
            name: "AlphaEvolve", 
            description: "LLM-driven program evolution for packing circles in a unit square.", 
            category: "AI/ML",
            link: "https://github.com/SUPR1M3/AlphaEvolve", 
            icon: AlphaEvolve, 
            color: "#10B981", 
            colorRgb: hexToRgb("#10B981"),
            tech: "Python, Ollama, Qwen3, NumPy, SciPy"
        },
        { 
            name: "PPO-Jax", 
            description: "PPO-Clip from scratch in pure JAX, fully jit-compiled training loop.", 
            category: "AI/ML",
            link: "https://github.com/SUPR1M3/PPO-Jax", 
            icon: PPOJax, 
            color: "#0EA5E9", 
            colorRgb: hexToRgb("#0EA5E9"),
            tech: "Python, Jax, Flax, Optax, Gymnax, Brax"
        },
        { 
            name: "Python Coding Agent", 
            description: "Basic Python coding assistant with tool-use.", 
            category: "Agent",
            link: "https://github.com/SUPR1M3/Agent-0", 
            icon: Agent, 
            color: "#20B2AA", 
            colorRgb: hexToRgb("#20B2AA"),
            tech: "Python, LLMs, Agents"
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
            tech: "Python, Q-Learning"
        },
        { 
            name: "LinkBot", 
            description: "LinkedIn Outreach Automation Bot", 
            category: "Automation Tool",
            link: "https://github.com/SUPR1M3/OutReach-Bot", 
            icon: LinkBot, 
            color: "#0077B5", 
            colorRgb: hexToRgb("#0077B5"),
            tech: "Python, Selenium, SQL"
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
            tech: "JavaScript, HTML5"
        },
        { 
            name: "Reel Good", 
            description: "IMDB Clone for Movie Reviews", 
            category: "Web App",
            link: "https://github.com/SUPR1M3/Reel-Good", 
            icon: ReelGood, 
            color: "#DC143C", 
            colorRgb: hexToRgb("#DC143C"),
            tech: "React, JavaScript, HTML"
        },
        { 
            name: "Portfolio", 
            description: "Professional Portfolio Website", 
            category: "Website",
            link: "https://github.com/SUPR1M3/react-portfolio", 
            icon: PortFolio, 
            color: "#9932CC", 
            colorRgb: hexToRgb("#9932CC"),
            tech: "React, CSS, HTML"
        },
    ]), []);

    // Build a repeated list so the wall feels dense and can loop. The grid
    // is `WALL_COLUMNS` columns wide, and the seamless-loop technique below
    // renders this list twice and animates translateY(-50%) - that only
    // lines up cleanly if this list's length is a multiple of WALL_COLUMNS
    // (otherwise the two halves have a ragged last row and the loop visibly
    // jumps). 2 full repeats of the base projects is rarely a clean
    // multiple on its own (11 projects -> 22, not divisible by 3), so
    // instead of a full 3rd repeat of everything, `shortfall` below tops
    // the list up to the next clean multiple with just a few single extra
    // copies - e.g. with 11 projects that's 2 extra copies for 24 total,
    // a smaller DOM than the old always-3x approach (48 nodes vs. 66).
    //
    // This means adding (or removing) projects in `baseProjects` above -
    // the plan was to allow up to 3 more - needs no changes here at all;
    // the padding recalculates itself (with up to 3 more projects, the
    // shortfall is always 0, 1, or 2 extra copies - never more). The only
    // thing that must still be kept in sync by hand is `WALL_COLUMNS`
    // below, which has to match `.wallTrack`'s `grid-template-columns`
    // column count in ProjectsStyles.module.css (currently
    // `repeat(3, minmax(0, 1fr))`) - if that ever changes, update
    // WALL_COLUMNS to match.
    //
    // EXTRA_APPEARANCE_ORDER picks which project(s) get an extra copy when
    // padding is needed, in order (cycling back to the start if more than
    // one round is needed) - purely a density/taste choice, edit freely.
    const WALL_COLUMNS = 3;
    const EXTRA_APPEARANCE_ORDER = ['Base Transformer', '10M Transformer'];
    const wallProjects = useMemo(() => {
        const repeats = 2;
        const items = [];
        for (let copy = 0; copy < repeats; copy += 1) {
            baseProjects.forEach((project, index) => {
                items.push({
                    ...project,
                    _wallId: `${copy}-${project.name}-${index}`,
                });
            });
        }
        const shortfall = (WALL_COLUMNS - (items.length % WALL_COLUMNS)) % WALL_COLUMNS;
        for (let i = 0; i < shortfall; i += 1) {
            const preferredName = EXTRA_APPEARANCE_ORDER[i % EXTRA_APPEARANCE_ORDER.length];
            const project = baseProjects.find((p) => p.name === preferredName) || baseProjects[i % baseProjects.length];
            items.push({ ...project, _wallId: `extra-${i}-${project.name}` });
        }
        return items;
    }, [baseProjects]);

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Projects</h1>

            <div className={styles.wallWrapper}>
                <div className={styles.wallViewport}>
                    {/* Paused while this section isn't visible - Projects is
                        always mounted (App.jsx renders all sections
                        side-by-side), so this animation would otherwise keep
                        compositing 60 backdrop-filtered cards forever. */}
                    <div
                        className={styles.wallTrack}
                        style={{ animationPlayState: isActive ? 'running' : 'paused' }}
                    >
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

// Memoized - see Hero.jsx for why.
export default React.memo(Projects);
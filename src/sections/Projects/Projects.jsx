import React, { useState, useRef, useEffect } from 'react';
import styles from './ProjectsStyles.module.css';
import covfefe from '../../assets/Covfefe.png';
import PortFolio from '../../assets/Favicon.png';
import BookLetter from '../../assets/BookLetterIcon.png';
import SpaceInvaders from '../../assets/SpaceShip.png';
import ReelGood from '../../assets/ReelGoodIcon.png';

function Projects() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const carouselRef = useRef(null);

    // Helper function to convert hex to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    };

    const projects = [
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
        }
    ];

    // Auto-rotation effect
    useEffect(() => {
        if (!isAutoRotating) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
        }, 4000); // Slightly slower for projects

        return () => clearInterval(interval);
    }, [isAutoRotating, projects.length]);

    const handlePrevious = () => {
        setIsAutoRotating(false);
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? projects.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setIsAutoRotating(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    };

    const handleCardClick = (index) => {
        setIsAutoRotating(false);
        setCurrentIndex(index);
    };

    const getCardPosition = (index) => {
        const totalCards = projects.length;
        const angleStep = (2 * Math.PI) / totalCards;
        const currentAngle = angleStep * (index - currentIndex);
        
        const radius = 280;
        const x = Math.sin(currentAngle) * radius;
        const z = Math.cos(currentAngle) * radius;
        
        // Scale and opacity based on position
        const scale = z > 0 ? 1 + (z / radius) * 0.3 : 0.7 + (z / radius) * 0.3;
        const opacity = z > -radius * 0.5 ? 1 : 0.85;
        const zIndex = Math.round(z);
        
        return { x, z, scale, opacity, zIndex };
    };

    return (
        <section className={styles.container}>
            <h1 className='sectionTitle'>Projects</h1>
            
            <div className={styles.projectsWrapper}>
                <div className={styles.carouselContainer} ref={carouselRef}>
                    <div className={styles.carousel3d}>
                        {projects.map((project, index) => {
                            const position = getCardPosition(index);
                            const isCenter = index === currentIndex;
                            
                            return (
                                <div
                                    key={project.name}
                                    className={`${styles.projectCard} ${isCenter ? styles.projectCardCenter : ''}`}
                                    style={{
                                        transform: `translateX(${position.x}px) translateZ(${position.z}px) scale(${position.scale})`,
                                        opacity: position.opacity,
                                        '--project-color': project.color,
                                        '--project-color-rgb': project.colorRgb
                                    }}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div className={styles.cardGlow} style={{ backgroundColor: project.color }}></div>
                                    <div className={isCenter ? styles.cardFront : styles.cardFrontInactive}>
                                        <div className={styles.cardImage}>
                                            <img src={project.icon} alt={project.name} />
                                        </div>
                                        <h3 className={styles.cardTitle}>{project.name}</h3>
                                        <p className={styles.cardCategory}>{project.category}</p>
                                        <p className={styles.cardDescription}>{project.description}</p>
                                        <div className={styles.techStack}>
                                            <span className={styles.techLabel}>Tech:</span>
                                            <span className={styles.techText}>{project.tech}</span>
                                        </div>
                                        {isCenter && (
                                            <a 
                                                href={project.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={styles.projectLink}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Project →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Navigation Controls */}
                <button 
                    className={`${styles.navButton} ${styles.navLeft}`}
                    onClick={handlePrevious}
                    aria-label="Previous project"
                >
                    ❮
                </button>
                <button 
                    className={`${styles.navButton} ${styles.navRight}`}
                    onClick={handleNext}
                    aria-label="Next project"
                >
                    ❯
                </button>
                
                {/* Auto-rotation toggle */}
                <button 
                    className={styles.autoRotateToggle}
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    aria-label={isAutoRotating ? "Pause auto-rotation" : "Start auto-rotation"}
                >
                    {isAutoRotating ? "⏸️" : "▶️"}
                </button>
                
                {/* Project counter */}
                <div className={styles.projectCounter}>
                    {currentIndex + 1} / {projects.length}
                </div>
            </div>
        </section>
    )
}

export default Projects
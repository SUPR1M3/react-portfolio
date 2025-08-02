import React, { useState, useRef, useEffect } from 'react';
import styles from './SkillsStyles.module.css';

function Skills() {
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

    const skills = [
          { name: "HTML", category: "Frontend", proficiency: 90, icon: "🌐", color: "#E34F26", colorRgb: hexToRgb("#E34F26") },
  { name: "CSS", category: "Frontend", proficiency: 85, icon: "🎨", color: "#1572B6", colorRgb: hexToRgb("#1572B6") },
  { name: "JavaScript", category: "Frontend", proficiency: 95, icon: "⚡", color: "#F7DF1E", colorRgb: hexToRgb("#F7DF1E") },
  { name: "React", category: "Frontend", proficiency: 90, icon: "⚛️", color: "#61DAFB", colorRgb: hexToRgb("#61DAFB") },
  { name: "Tailwind", category: "Frontend", proficiency: 80, icon: "💨", color: "#06B6D4", colorRgb: hexToRgb("#06B6D4") },
  { name: "Node.js", category: "Backend", proficiency: 75, icon: "🟢", color: "#339933", colorRgb: hexToRgb("#339933") },
  { name: "Python", category: "Backend", proficiency: 85, icon: "🐍", color: "#3776AB", colorRgb: hexToRgb("#3776AB") },
  { name: "Express", category: "Backend", proficiency: 70, icon: "🚀", color: "#68D391", colorRgb: hexToRgb("#68D391") },
  { name: "C++", category: "Backend", proficiency: 65, icon: "⚙️", color: "#00599C", colorRgb: hexToRgb("#00599C") },
  { name: "Java", category: "Backend", proficiency: 75, icon: "☕", color: "#ED8B00", colorRgb: hexToRgb("#ED8B00") },
  { name: "MySQL", category: "Database", proficiency: 80, icon: "🗄️", color: "#4479A1", colorRgb: hexToRgb("#4479A1") },
  { name: "MongoDB", category: "Database", proficiency: 70, icon: "🍃", color: "#47A248", colorRgb: hexToRgb("#47A248") },
  { name: "Docker", category: "Tools", proficiency: 65, icon: "🐳", color: "#2496ED", colorRgb: hexToRgb("#2496ED") },
  { name: "Postman", category: "Tools", proficiency: 85, icon: "📮", color: "#FF6C37", colorRgb: hexToRgb("#FF6C37") },
  { name: "C", category: "Backend", proficiency: 75, icon: "🔧", color: "#A8B9CC", colorRgb: hexToRgb("#A8B9CC") }
    ];

    // Auto-rotation effect
    useEffect(() => {
        if (!isAutoRotating) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoRotating, skills.length]);

    const handlePrevious = () => {
        setIsAutoRotating(false);
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? skills.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setIsAutoRotating(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length);
    };

    const handleCardClick = (index) => {
        setIsAutoRotating(false);
        setCurrentIndex(index);
    };

    const getCardPosition = (index) => {
        const totalCards = skills.length;
        const angleStep = (2 * Math.PI) / totalCards;
        const currentAngle = angleStep * (index - currentIndex);
        
        const radius = 280;
        const x = Math.sin(currentAngle) * radius;
        const z = Math.cos(currentAngle) * radius;
        
        // Scale and opacity based on position
        const scale = z > 0 ? 1 + (z / radius) * 0.3 : 0.7 + (z / radius) * 0.3;
        const opacity = z > -radius * 0.5 ? 1 : 0.85; // Increased from 0.3 to 0.85
        const zIndex = Math.round(z);
        
        return { x, z, scale, opacity, zIndex };
    };

    return (
        <section className={styles.container}>
            <h1 className='sectionTitle'>Skills</h1>
            
            <div className={styles.skillsWrapper}>
                {/* Other Achievements Section */}
                <div className={styles.achievementsSection}>
                    <h3 className={styles.achievementsTitle}>Achievements</h3>
                    <div className={styles.achievementsList}>
                        <div className={styles.achievementItem}>
                            <h4 className={styles.achievementName}>Dean's Merit List</h4>
                            <p className={styles.achievementDescription}>
                                Awarded along with a substantial scholarship for academic excellence at IIIT-Bangalore.
                            </p>
                        </div>
                        <div className={styles.achievementItem}>
                            <h4 className={styles.achievementName}>ACM ICPC Chennai Regional Qualifier</h4>
                            <p className={styles.achievementDescription}>
                                Premier collegiate programming competition held all over the world
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className={styles.carouselContainer} ref={carouselRef}>
                    <div className={styles.carousel3d}>
                        {skills.map((skill, index) => {
                            const position = getCardPosition(index);
                            const isCenter = index === currentIndex;
                            
                            return (
                                <div
                                    key={skill.name}
                                    className={`${styles.skillCard} ${isCenter ? styles.skillCardCenter : ''}`}
                                    style={{
                                        transform: `translateX(${position.x}px) translateZ(${position.z}px) scale(${position.scale})`,
                                        opacity: position.opacity,
                                        '--skill-color': skill.color,
                                        '--skill-color-rgb': skill.colorRgb
                                    }}
                                    onClick={() => handleCardClick(index)}
                                                                >
                                    <div className={styles.cardGlow} style={{ backgroundColor: skill.color }}></div>
                                    <div className={isCenter ? styles.cardFront : styles.cardFrontInactive}>
                                        <div className={styles.cardIcon}>{skill.icon}</div>
                                        <h3 className={styles.cardTitle}>{skill.name}</h3>
                                        <p className={styles.cardCategory}>{skill.category}</p>
                                        <div className={styles.proficiencyBar}>
                                            <div 
                                                className={styles.proficiencyFill} 
                                                style={{ 
                                                    width: `${skill.proficiency}%`,
                                                    backgroundColor: skill.color,
                                                    boxShadow: `0 0 10px ${skill.color}`
                                                }}
                                            ></div>
                                        </div>
                                        <span className={styles.proficiencyText}>{skill.proficiency}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Navigation Controls - Outside carousel container for proper z-index layering */}
                <button 
                    className={`${styles.navButton} ${styles.navLeft}`}
                    onClick={handlePrevious}
                    aria-label="Previous skill"
                >
                    ❮
                </button>
                <button 
                    className={`${styles.navButton} ${styles.navRight}`}
                    onClick={handleNext}
                    aria-label="Next skill"
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
                
                {/* Skill counter */}
                <div className={styles.skillCounter}>
                    {currentIndex + 1} / {skills.length}
                </div>
                
                {/* Skills Index */}
                <div className={styles.skillsIndex}>
                    <h3 className={styles.indexTitle}>Skills Index</h3>
                    <div className={styles.indexList}>
                        {skills.map((skill, index) => (
                            <div
                                key={skill.name}
                                className={`${styles.indexItem} ${index === currentIndex ? styles.indexItemActive : ''}`}
                                onClick={() => handleCardClick(index)}
                            >
                                <div className={styles.indexIcon} style={{ color: skill.color }}>
                                    {skill.icon}
                                </div>
                                <div className={styles.indexContent}>
                                    <span className={styles.indexName}>{skill.name}</span>
                                    <span className={styles.indexCategory}>{skill.category}</span>
                                    <div className={styles.indexProficiency}>
                                        <div 
                                            className={styles.indexBar}
                                            style={{ 
                                                width: `${skill.proficiency}%`,
                                                backgroundColor: skill.color 
                                            }}
                                        ></div>
                                        <span className={styles.indexPercent}>{skill.proficiency}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills
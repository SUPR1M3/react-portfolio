import React from 'react';
import styles from './ProjectsStyles.module.css';
import viberr from '../../assets/viberr.png';
import PortFolio from '../../assets/Favicon.png';
import BookLetter from '../../assets/BookLetterIcon.png'
import ProjectCard from '../../common/ProjectCard.jsx';

function Projects() {
  return (
    <section id='projects' className={styles.container}>
        <h1 className='sectionTitle'>Projects</h1>
        <div className={styles.projectsContainer}>
            <ProjectCard icon = {viberr} link ="" heading="Viberr" desc="Streaming App"/>
            <ProjectCard icon = {BookLetter} link ="https://github.com/SUPR1M3/BookLetter" heading="BookLetter" desc="Library Database"/>
            <ProjectCard icon = {PortFolio} link ="https://github.com/SUPR1M3/react-portfolio" heading="PortFolio" desc="Professional Portfolio"/>
        </div>
    </section>
  )
}

export default Projects
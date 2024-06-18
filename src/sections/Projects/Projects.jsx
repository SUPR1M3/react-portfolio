import React from 'react';
import styles from './ProjectsStyles.module.css';
import viberr from '../../assets/viberr.png'
import ProjectCard from '../../common/ProjectCard.jsx';

function Projects() {
  return (
    <section id='projects' className={styles.container}>
        <h1 className='sectionTitle'>Projects</h1>
        <div className={styles.projectsContainer}>
            <ProjectCard icon = {viberr} link ="" heading="Viberr"/>
        </div>
    </section>
  )
}

export default Projects
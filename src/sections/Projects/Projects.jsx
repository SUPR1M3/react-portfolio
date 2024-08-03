import React from 'react';
import styles from './ProjectsStyles.module.css';
import covfefe from '../../assets/Covfefe.png';
import PortFolio from '../../assets/Favicon.png';
import BookLetter from '../../assets/BookLetterIcon.png'
import SpaceInvaders from '../../assets/SpaceShip.png'
import ProjectCard from '../../common/ProjectCard.jsx';

function Projects() {
  return (
    <section id='projects' className={styles.container}>
        <h1 className='sectionTitle'>Projects</h1>
        <div className={styles.projectsContainer}>
            <ProjectCard icon = {covfefe} link ="https://github.com/SUPR1M3/Covfefe" heading="Covfefe" desc="Zomato for Cafes"/>
            <ProjectCard icon = {BookLetter} link ="https://github.com/SUPR1M3/BookLetter" heading="BookLetter" desc="Library Database"/>
            <ProjectCard icon = {SpaceInvaders} link ="https://github.com/SUPR1M3/Space-Invaders" heading="Space-Invaders" desc="Classic Video Game"/>
            <ProjectCard icon = {PortFolio} link ="https://github.com/SUPR1M3/react-portfolio" heading="PortFolio" desc="Professional Portfolio"/>
        </div>
    </section>
  )
}

export default Projects
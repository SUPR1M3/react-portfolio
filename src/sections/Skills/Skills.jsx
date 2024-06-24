import React from 'react';
import styles from './SkillsStyles.module.css';
import Skill from './Skill';

function Skills() {

    return (
        <section id='skills' className={styles.container}>
            <h1 className='sectionTitle'>Skills</h1>
            <div className={styles.skillList}>
                <Skill skillname="HTML"/>
                <Skill skillname="CSS"/>
                <Skill skillname="Javascript"/>
                <Skill skillname="React"/>
                <Skill skillname="Node"/>
            </div>
            <hr/>
            <div className={styles.skillList}>
                <Skill skillname="Python"/>
                <Skill skillname="C++"/>
                <Skill skillname="Tailwind"/>
                <Skill skillname="C"/>
                <Skill skillname="Express"/>
            </div>
            <hr/>
            <div className={styles.skillList}>
                <Skill skillname="Java"/>
                <Skill skillname="MySQL"/>
                <Skill skillname="MongoDB"/>
                <Skill skillname="Docker"/>
                <Skill skillname="Postman"/>
            </div>
        </section>
    )
}

export default Skills
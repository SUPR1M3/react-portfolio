import React from 'react'
import checkMarkIconLight from '../../assets/checkmark-light.svg';
import checkMarkIconDark from '../../assets/checkmark-dark.svg';
import styles from './SkillsStyles.module.css';
import { useTheme } from '../../common/ThemeContext';

function Skill(props) {
    const {theme,toggleTheme} = useTheme();
    return (
        <div className={styles.skill}>
            <img className="LightCheckMark" src={checkMarkIconLight} style={{ opacity: theme === 'light' ? 1 : 0 }} alt="Checkmark icon Light" />
            <img className="DarkCheckMark" src={checkMarkIconDark} style={{ opacity: theme === 'light' ? 0 : 1 }} alt="Checkmark icon Dark" />
            <p>{props.skillname}</p>
        </div>
    )
}

export default Skill
import React from 'react';
import styles from './HeroStyles.module.css';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import { useTheme } from '../../common/ThemeContext';

export default function LDSwitch(){
    const {theme,toggleTheme} = useTheme();
    return <div className={styles.ThemeSwitchCon}>
                    <img className={styles.LightModeIcon} src={sun} onClick={toggleTheme} style={{opacity:theme==='light'?1:0}} alt='Color mode icon'/>
                    <img className={styles.DarkModeIcon} src={moon} onClick={toggleTheme} style={{opacity:theme==='light'?0:1}}alt='Color mode icon'/>
            </div>
}
import React from 'react';
import { useTheme } from '../../common/ThemeContext';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import './WaterSwitch.css';

export default function LiquidContainerSwitch() {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <div className={`liquid-container-switch variant-1 ${theme}`} onClick={toggleTheme}>
            <div className={`liquid-fill variant-1 ${theme}`}></div>
            <div className="floating-icons variant-1">
                <img 
                    src={sun} 
                    alt="Light mode" 
                    className={`sun-icon variant-1 ${theme === 'light' ? 'active' : ''}`}
                />
                <img 
                    src={moon} 
                    alt="Dark mode" 
                    className={`moon-icon variant-1 ${theme === 'dark' ? 'active' : ''}`}
                />
            </div>
        </div>
    );
} 
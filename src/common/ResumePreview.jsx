import React from 'react';
import { useResumePreview } from './ResumePreviewContext';
import CV from '../assets/Resume_Suraj_Singh.pdf';
import './ResumePreview.css';

export default function ResumePreview() {
    const { 
        showResumePreview, 
        isClosing,
        resumePreviewRef, 
        closeResumePreview 
    } = useResumePreview();

    if (!showResumePreview) return null;

    return (
        <div 
            ref={resumePreviewRef} 
            className={`resume-preview-card ${isClosing ? 'closing' : ''}`}
        >
            <button 
                className="resume-close-button"
                onClick={closeResumePreview}
            >
                ×
            </button>
            <iframe 
                src={CV}
                title="Resume Preview"
                className="resume-iframe"
            />
        </div>
    );
}
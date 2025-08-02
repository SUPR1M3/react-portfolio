import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const ResumePreviewContext = createContext();

export const useResumePreview = () => useContext(ResumePreviewContext);

export const ResumePreviewProvider = ({ children }) => {
    const [showResumePreview, setShowResumePreview] = useState(false);
    const [resumeClicked, setResumeClicked] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const resumePreviewRef = useRef(null);
    const resumeButtonRef = useRef(null);
    const hoverTimeoutRef = useRef(null);
    const closeTimeoutRef = useRef(null);
    
    const closeResumePreview = () => {
        // Clear any pending timeouts
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        
        setIsClosing(true);
        setTimeout(() => {
            setResumeClicked(false);
            setShowResumePreview(false);
            setIsClosing(false);
        }, 300);
    };

    // Handle clicking outside the resume preview
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showResumePreview && resumeClicked && 
                resumePreviewRef.current && 
                resumeButtonRef.current &&
                !resumePreviewRef.current.contains(event.target) &&
                !resumeButtonRef.current.contains(event.target)) {
                closeResumePreview();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showResumePreview, resumeClicked]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const openResumePreview = () => {
        setShowResumePreview(true);
    };

    const toggleResumePreview = () => {
        if (resumeClicked) {
            closeResumePreview();
        } else {
            setResumeClicked(true);
            setShowResumePreview(true);
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
        
        // Clear any pending close timeout
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        
        // Cancel closing animation if in progress
        if (isClosing && !resumeClicked) {
            setIsClosing(false);
        }
        
        // Only set hover timeout if not already clicked and not already showing
        if (!resumeClicked && !showResumePreview) {
            // Clear any existing hover timeout
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            
            // Set new hover timeout for 0.2s delay
            hoverTimeoutRef.current = setTimeout(() => {
                setShowResumePreview(true);
                hoverTimeoutRef.current = null;
            }, 200);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        
        // Clear hover timeout to prevent opening if user moves away quickly
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        
        // Only start close process if not clicked
        if (!resumeClicked && !isClosing) {
            setIsClosing(true);
            closeTimeoutRef.current = setTimeout(() => {
                setShowResumePreview(false);
                setIsClosing(false);
                closeTimeoutRef.current = null;
            }, 300);
        }
    };

    return (
        <ResumePreviewContext.Provider value={{
            showResumePreview,
            resumeClicked,
            isHovering,
            isClosing,
            resumePreviewRef,
            resumeButtonRef,
            openResumePreview,
            closeResumePreview,
            toggleResumePreview,
            handleMouseEnter,
            handleMouseLeave
        }}>
            {children}
        </ResumePreviewContext.Provider>
    );
};
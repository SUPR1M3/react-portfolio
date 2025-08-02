import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import './LiquidCursor.css';

const LiquidCursor = () => {
  const { theme } = useTheme();
  const gooeyRef = useRef(null);
  const cursorDotRef = useRef(null);
  const ball1Ref = useRef(null);
  const ball2Ref = useRef(null);
  const ball3Ref = useRef(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const ball1Pos = useRef({ x: 0, y: 0 });
  const ball2Pos = useRef({ x: 0, y: 0 });
  const ball3Pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;
    
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // Cursor dot follows mouse exactly (centered)
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mousePos.current.x}px`;
        cursorDotRef.current.style.top = `${mousePos.current.y}px`;
      }

      // Ball 1: Stays with cursor with miniscule delay for flow simulation (95%)
      ball1Pos.current.x = lerp(ball1Pos.current.x, mousePos.current.x, 0.95);
      ball1Pos.current.y = lerp(ball1Pos.current.y, mousePos.current.y, 0.95);
      
      // Ball 2: Trails Ball 1 with heavy delay (15%) - makes it lag behind more
      ball2Pos.current.x = lerp(ball2Pos.current.x, ball1Pos.current.x, 0.15);
      ball2Pos.current.y = lerp(ball2Pos.current.y, ball1Pos.current.y, 0.15);
      
      // Ball 3: Follows Ball 2 with moderate delay (30%) - stays closer to Ball 2
      ball3Pos.current.x = lerp(ball3Pos.current.x, ball2Pos.current.x, 0.30);
      ball3Pos.current.y = lerp(ball3Pos.current.y, ball2Pos.current.y, 0.30);

      // Apply positions to DOM elements with proper centering
      if (ball1Ref.current) {
        ball1Ref.current.style.left = `${ball1Pos.current.x}px`;
        ball1Ref.current.style.top = `${ball1Pos.current.y}px`;
      }
      if (ball2Ref.current) {
        ball2Ref.current.style.left = `${ball2Pos.current.x}px`;
        ball2Ref.current.style.top = `${ball2Pos.current.y}px`;
      }
      if (ball3Ref.current) {
        ball3Ref.current.style.left = `${ball3Pos.current.x}px`;
        ball3Ref.current.style.top = `${ball3Pos.current.y}px`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Visible cursor dot */}
      <div className={`cursor-dot ${theme}`} ref={cursorDotRef}></div>
      
      {/* Liquid balls with gooey effect - ordered for optimal z-index */}
      <div className={`liquid-cursor ${theme}`} ref={gooeyRef}>
        <div className="cursor-ball cursor-ball-3" ref={ball3Ref}></div>
        <div className="cursor-ball cursor-ball-1" ref={ball1Ref}></div>
        <div className="cursor-ball cursor-ball-2" ref={ball2Ref}></div>
      </div>
    </>
  );
};

export default LiquidCursor; 
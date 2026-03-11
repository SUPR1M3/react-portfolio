import React, { useEffect, useRef, useState } from 'react';
import './MoreNavigation.css';

const MoreNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const hoverIntentTimeoutRef = useRef(null);
  const scrollTargetLeftRef = useRef(null);
  const isScrollLockedRef = useRef(false);
  const queuedSectionIdRef = useRef(null);
  const activeTargetSectionIdRef = useRef(null);

  const navigationItems = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'skills', label: 'Skills', icon: '💡' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'contact', label: 'Contact', icon: '📧' }
  ];

  // SVG dimensions and radii (matching the library's approach)
  const innerRadius = 60;
  const outerRadius = 120;
  const centerX = outerRadius;
  const centerY = outerRadius;
  const svgSize = outerRadius * 2;
  const middleRadius = (innerRadius + outerRadius) / 2;

  useEffect(() => {
    containerRef.current = document.querySelector('.horizontal-scroll-container');
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!isScrollLockedRef.current) return;
      if (scrollTargetLeftRef.current == null) return;

      // Consider the scroll "done" when close to the target.
      const diff = Math.abs(container.scrollLeft - scrollTargetLeftRef.current);
      if (diff <= 2) {
        isScrollLockedRef.current = false;
        scrollTargetLeftRef.current = null;

        // If user hovered another item during the scroll, run it next.
        const queued = queuedSectionIdRef.current;
        if (queued && queued !== activeTargetSectionIdRef.current) {
          queuedSectionIdRef.current = null;
          // Let snap settle for a moment before starting the next smooth scroll.
          window.setTimeout(() => {
            requestScrollToSection(queued, false);
          }, 60);
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getScrollLeftForSection = (sectionId) => {
    const sections = ['hero', 'skills', 'projects', 'contact'];
    const sectionIndex = sections.indexOf(sectionId);
    if (sectionIndex === -1) return null;
    return sectionIndex * window.innerWidth;
  };

  const requestScrollToSection = (sectionId, shouldCloseMenu = false) => {
    const container = containerRef.current || document.querySelector('.horizontal-scroll-container');
    if (!container) return;

    const targetLeft = getScrollLeftForSection(sectionId);
    if (targetLeft == null) return;

    // If we’re mid smooth-scroll, queue the latest hover target.
    if (isScrollLockedRef.current) {
      queuedSectionIdRef.current = sectionId;
      if (shouldCloseMenu) setIsOpen(false);
      return;
    }

    // Avoid re-triggering smooth scroll to the same place.
    if (Math.abs(container.scrollLeft - targetLeft) <= 2) {
      activeTargetSectionIdRef.current = sectionId;
      if (shouldCloseMenu) setIsOpen(false);
      return;
    }

    activeTargetSectionIdRef.current = sectionId;
    isScrollLockedRef.current = true;
    scrollTargetLeftRef.current = targetLeft;
    queuedSectionIdRef.current = null;

    container.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });

    // Failsafe unlock in case scroll events don’t land exactly on target.
    window.setTimeout(() => {
      if (!isScrollLockedRef.current) return;
      isScrollLockedRef.current = false;
      scrollTargetLeftRef.current = null;
      const queued = queuedSectionIdRef.current;
      if (queued && queued !== activeTargetSectionIdRef.current) {
        queuedSectionIdRef.current = null;
        requestScrollToSection(queued, false);
      }
    }, 700);

    if (shouldCloseMenu) {
      setIsOpen(false);
    }
  };

  const scheduleHoverScroll = (sectionId) => {
    if (hoverIntentTimeoutRef.current) {
      clearTimeout(hoverIntentTimeoutRef.current);
      hoverIntentTimeoutRef.current = null;
    }

    // Hover intent delay prevents rapid retargeting while cursor moves between items.
    hoverIntentTimeoutRef.current = window.setTimeout(() => {
      hoverIntentTimeoutRef.current = null;
      requestScrollToSection(sectionId, false);
    }, 180);
  };

  const cancelHoverScroll = () => {
    if (hoverIntentTimeoutRef.current) {
      clearTimeout(hoverIntentTimeoutRef.current);
      hoverIntentTimeoutRef.current = null;
    }
  };

  const handleMenuEnter = () => {
    setIsOpen(true);
  };

  const handleMenuLeave = () => {
    cancelHoverScroll();
    setIsOpen(false);
  };

  // Generate SVG path for radial segment (replicating library's approach)
  const createSegmentPath = (startAngle, endAngle, innerR, outerR) => {
    const x1 = outerR * Math.cos(startAngle);
    const y1 = outerR * Math.sin(startAngle);
    const x2 = outerR * Math.cos(endAngle);
    const y2 = outerR * Math.sin(endAngle);
    const x3 = innerR * Math.cos(startAngle);
    const y3 = innerR * Math.sin(startAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return `
      M ${outerR} ${outerR}
      m ${x3} ${y3}
      l ${x1 - x3} ${y1 - y3}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2 + outerR} ${y2 + outerR}
      l ${innerR * Math.cos(endAngle) - x2} ${innerR * Math.sin(endAngle) - y2}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${outerR + x3} ${outerR + y3}
    `;
  };

  // Calculate item positions (for downward semicircle)
  const calculateItemPosition = (index, totalItems) => {
    // For downward semicircle: reverse order so Home is leftmost, Contact is rightmost
    const angleStep = Math.PI / totalItems;
    const reversedIndex = totalItems - 1 - index; // Reverse the order
    
    // Calculate the exact center of each segment
    const segmentStartAngle = angleStep * reversedIndex;
    const segmentEndAngle = angleStep * (reversedIndex + 1);
    const itemAngle = (segmentStartAngle + segmentEndAngle) / 2; // Perfect center of segment
    
    // Position at middle radius
    const x = Math.cos(itemAngle) * middleRadius + centerX;
    const y = Math.sin(itemAngle) * middleRadius + centerY;
    
    // Calculate size based on available space
    const objectSize = Math.min(innerRadius / Math.sqrt(2), outerRadius - innerRadius);
    
    return {
      x: x - objectSize / 2,
      y: y - objectSize / 2,
      size: objectSize,
      startAngle: segmentStartAngle,
      endAngle: segmentEndAngle,
      centerX: x, // Store the exact center for perfect transform-origin
      centerY: y
    };
  };

  return (
    <div 
      className="more-navigation"
      onMouseEnter={handleMenuEnter}
      onMouseLeave={handleMenuLeave}
    >
      {/* Trigger button */}
      <button className={`more-trigger ${isOpen ? 'open' : ''}`}>
        <span className="trigger-icon">⋯</span>
        <span className="trigger-text">More</span>
      </button>

      {/* SVG Radial Menu (replicating library approach) */}
      <svg
        className={`radial-menu-svg ${isOpen ? 'open' : ''}`}
        width={svgSize + 40}
        height={svgSize + 40}
        viewBox={`-23 -23 ${svgSize + 46} ${svgSize + 46}`}
      >
        {/* Gradients for liquid design */}
        <defs>
          <linearGradient id="cssGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:'#764ba2', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#f093fb', stopOpacity:1}} />
          </linearGradient>
          <radialGradient id="cssGradientHover" cx="50%" cy="50%" r="70%">
            <stop offset="0%" style={{stopColor:'#ff9a9e', stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:'#fecfef', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#fecfef', stopOpacity:1}} />
          </radialGradient>
        </defs>

        {/* Background semicircle - downward facing */}
        <path
          className="menu-background"
          d={`M ${centerX - outerRadius} ${centerY}
              A ${outerRadius} ${outerRadius} 0 0 0 ${centerX + outerRadius} ${centerY}
              L ${centerX + innerRadius} ${centerY}
              A ${innerRadius} ${innerRadius} 0 0 1 ${centerX - innerRadius} ${centerY}
              Z`}
        />

        {/* Menu Items */}
        {navigationItems.map((item, index) => {
          const position = calculateItemPosition(index, navigationItems.length);
          const segmentPath = createSegmentPath(
            position.startAngle, 
            position.endAngle, 
            innerRadius, 
            outerRadius
          );

          return (
            <g 
              key={item.id} 
              className="menu-item-group"
              style={{
                '--center-x': `${position.centerX}px`,
                '--center-y': `${position.centerY}px`
              }}
            >
              {/* Segment background */}
              <path
                className="menu-segment"
                d={segmentPath}
                onClick={() => requestScrollToSection(item.id, true)}
                onMouseEnter={() => scheduleHoverScroll(item.id)}
                onMouseLeave={cancelHoverScroll}
              />
              
              {/* Item content */}
              <foreignObject
                x={position.x}
                y={position.y}
                width={position.size}
                height={position.size}
                onClick={() => requestScrollToSection(item.id, true)}
                onMouseEnter={() => scheduleHoverScroll(item.id)}
                onMouseLeave={cancelHoverScroll}
              >
                <div className="menu-item-content">
                  <span className="menu-item-icon">{item.icon}</span>
                  <span className="menu-item-label">{item.label}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MoreNavigation;
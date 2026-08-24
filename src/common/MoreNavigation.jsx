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

  // Geometry lives entirely in SVG user units. The SVG is sized with CSS;
  // viewBox matches this square so 1 user unit scales uniformly on any monitor.
  const innerRadius = 60;
  const outerRadius = 120;
  const centerX = outerRadius;
  const centerY = outerRadius;
  const svgSize = outerRadius * 2;
  const viewPadding = 28;
  const viewBoxSize = svgSize + viewPadding * 2;
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
      return;
    }

    // Avoid re-triggering smooth scroll to the same place.
    if (Math.abs(container.scrollLeft - targetLeft) <= 2) {
      activeTargetSectionIdRef.current = sectionId;
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

  const polar = (radius, angle) => [
    centerX + radius * Math.cos(angle),
    centerY + radius * Math.sin(angle),
  ];

  const createSegmentPath = (startAngle, endAngle, innerR, outerR) => {
    const [ox1, oy1] = polar(outerR, startAngle);
    const [ox2, oy2] = polar(outerR, endAngle);
    const [ix1, iy1] = polar(innerR, startAngle);
    const [ix2, iy2] = polar(innerR, endAngle);
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return [
      `M ${ox1} ${oy1}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${ox2} ${oy2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ');
  };

  const calculateItemPosition = (index, totalItems) => {
    const angleStep = Math.PI / totalItems;
    const reversedIndex = totalItems - 1 - index;
    const startAngle = angleStep * reversedIndex;
    const endAngle = angleStep * (reversedIndex + 1);
    const itemAngle = (startAngle + endAngle) / 2;

    return {
      startAngle,
      endAngle,
      itemAngle,
      centerX: centerX + Math.cos(itemAngle) * middleRadius,
      centerY: centerY + Math.sin(itemAngle) * middleRadius,
    };
  };

  return (
    <div 
      className="more-navigation"
      onMouseEnter={handleMenuEnter}
      onMouseLeave={handleMenuLeave}
    >
      <div className="more-nav-stage">
        <svg
          className={`radial-menu-svg ${isOpen ? 'open' : ''}`}
          viewBox={`${-viewPadding} ${-viewPadding} ${viewBoxSize} ${viewBoxSize}`}
          preserveAspectRatio="xMidYMid meet"
        >
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

          <path
            className="menu-background"
            d={`M ${centerX - outerRadius} ${centerY}
                A ${outerRadius} ${outerRadius} 0 0 0 ${centerX + outerRadius} ${centerY}
                L ${centerX + innerRadius} ${centerY}
                A ${innerRadius} ${innerRadius} 0 0 1 ${centerX - innerRadius} ${centerY}
                Z`}
          />

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
                className="menu-item-anchor"
                transform={`translate(${position.centerX} ${position.centerY})`}
              >
                <g
                  className="menu-item-group"
                  onClick={() => requestScrollToSection(item.id, false)}
                  onMouseEnter={() => scheduleHoverScroll(item.id)}
                  onMouseLeave={cancelHoverScroll}
                >
                  <path
                    className="menu-segment"
                    d={segmentPath}
                    transform={`translate(${-position.centerX} ${-position.centerY})`}
                  />
                  <text
                    className="menu-item-icon"
                    x="0"
                    y="-7"
                    fontSize="16"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {item.icon}
                  </text>
                  <text
                    className="menu-item-label"
                    x="0"
                    y="12"
                    fontSize="8"
                    letterSpacing="0.35"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {item.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        <button type="button" className={`more-trigger ${isOpen ? 'open' : ''}`}>
          <span className="trigger-icon">⋯</span>
          <span className="trigger-text">More</span>
        </button>
      </div>
    </div>
  );
};

export default MoreNavigation;
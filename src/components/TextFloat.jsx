import React from 'react';
import { useTextFloat } from '../hooks/useTextFloat';
import './TextFloat.css';

const TextFloat = ({ 
  children, 
  className = '',
  as = 'h2',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  scrub = true
}) => {
  const textRef = useTextFloat({
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    scrub
  });

  const Tag = as; // Permite usar h1, h2, h3, p, etc.

  return (
    <Tag 
      ref={textRef} 
      className={`text-float ${className}`}
    >
      {children}
    </Tag>
  );
};

export default TextFloat;
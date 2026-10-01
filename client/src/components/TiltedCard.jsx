import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedCard.css';

const springValues = {
  damping: 25,
  stiffness: 120,
  mass: 1.5
};

export default function TiltedCard({
  children,
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = 'auto',
  containerWidth = '100%',
  scaleOnHover = 1.03,
  rotateAmplitude = 12,
  showMobileWarning = false,
  showTooltip = false,
  className = '',
  style = {}
}) {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawScale = useMotionValue(1);
  const rawOpacity = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, springValues);
  const rotateY = useSpring(rawRotateY, springValues);
  const scale = useSpring(rawScale, springValues);
  const opacity = useSpring(rawOpacity, { damping: 20, stiffness: 150 });
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rawRotateX.set(rotX);
    rawRotateY.set(rotY);

    rawX.set(e.clientX - rect.left + 12);
    rawY.set(e.clientY - rect.top + 12);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    rawScale.set(scaleOnHover);
    rawOpacity.set(1);
  }

  function handleMouseLeave() {
    rawOpacity.set(0);
    rawScale.set(1);
    rawRotateX.set(0);
    rawRotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <div
      ref={ref}
      className="tilted-card-wrapper"
      style={{
        perspective: 1000,
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`tilted-card-inner ${className}`}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          height: '100%',
          width: '100%',
          ...style
        }}
      >
        {children ? (
          children
        ) : (
          <img
            src={imageSrc}
            alt={altText}
            className="tilted-card-img"
          />
        )}

        {showTooltip && (
          <motion.div
            className="tilted-card-caption"
            style={{
              x: rawX,
              y: rawY,
              opacity,
              rotate: rotateFigcaption,
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 30
            }}
          >
            {captionText}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

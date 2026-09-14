'use client';

import React, { useEffect, useState } from 'react';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1150; // fills 0-100% in 1.15s, remaining 0.35s for smooth exit transition = 1.5s total

    let animationFrameId;

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressPercent = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(progressPercent);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setIsDone(true);
        setTimeout(() => {
          setShouldRender(false);
        }, 350);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div className={`fitech-page-loader ${isDone ? 'fitech-loader-fade' : ''}`}>
      <div className="fitech-loader-container">
        <h1 className="fitech-loader-text">FITECH</h1>
        <div className="fitech-loader-bar-wrap">
          <div
            className="fitech-loader-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

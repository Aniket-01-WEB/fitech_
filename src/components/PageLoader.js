'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 18) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setFading(true);
        setTimeout(() => {
          setLoaded(true);
        }, 400);
      }
      setProgress(currentProgress);
    }, 30);

    // Fallback safety cleanup
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      setFading(true);
      setTimeout(() => setLoaded(true), 400);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (loaded) return null;

  return (
    <div className={`page-loader ${fading ? 'loaded' : ''}`}>
      <div className="loader-content">
        <div className="loader-brand">
          <Image
            src="/real_logo_org.png"
            alt="MATRIX Logo"
            width={52}
            height={52}
            className="loader-logo"
            priority
          />
          <span className="loader-title">MATRIX</span>
        </div>
        <div className="loader-progress-wrap">
          <div className="loader-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="loader-meta">
          <span>Initializing Engine</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}


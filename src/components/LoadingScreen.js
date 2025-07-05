// src/components/LoadingScreen.js
import React, { useEffect, useRef, useState } from 'react';
import './LoadingScreen.css';
import anime from 'animejs/lib/anime.es.js';
import vid1 from '../assets/vid1.mp4';
import vid2 from '../assets/vid2.mp4';
import vid3 from '../assets/vid3.mp4';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const videoRefs = useRef([null, null, null]);
  const containerRef = useRef(null);
  const titleContainerRef = useRef(null);
  const [videosReady, setVideosReady] = useState(false);
  
  // Initialize animation and video playback after components mount
  useEffect(() => {
    let isMounted = true;
    let animeInstance = null;
    
    // Initialize videos only after DOM is fully loaded
    const setupVideos = () => {
      try {
        if (!isMounted) return;
        
        const firstVideo = videoRefs.current[0];
        if (firstVideo) {
          firstVideo.playbackRate = 2.0;
          firstVideo.play().catch(err => console.error("Video playback error:", err));
          firstVideo.classList.add('visible');
          setVideosReady(true);
        }
        
        // Schedule transitions with safety checks
        const transition1 = setTimeout(() => {
          if (isMounted && videoRefs.current[0] && videoRefs.current[1]) {
            crossFadeToVideo(0, 1);
          }
        }, 2300);
        
        const transition2 = setTimeout(() => {
          if (isMounted && videoRefs.current[1] && videoRefs.current[2]) {
            crossFadeToVideo(1, 2);
          }
        }, 4650);
        
        return () => {
          clearTimeout(transition1);
          clearTimeout(transition2);
        };
      } catch (error) {
        console.error("Video setup error:", error);
        return () => {};
      }
    };
    
    // Set up loading progress
    const setupLoading = () => {
      const totalLoadingTime = 7500;
      const updateInterval = 250;
      const steps = totalLoadingTime / updateInterval;
      
      const loadingTimer = setInterval(() => {
        if (!isMounted) return;
        
        setLoadingProgress(prev => {
          const newProgress = prev + (100 / steps);
          if (newProgress >= 100) {
            clearInterval(loadingTimer);
            if (containerRef.current) {
              containerRef.current.classList.add('fade-out');
            }
            setTimeout(() => {
              if (isMounted) onLoadingComplete();
            }, 1000);
            return 100;
          }
          return newProgress;
        });
      }, updateInterval);
      
      return () => clearInterval(loadingTimer);
    };
    
    // Setup animations with anime.js after ensuring DOM is ready
    const setupAnimation = () => {
      setTimeout(() => {
        if (isMounted && titleContainerRef.current) {
          try {
            // Create slower animation with longer durations
            animeInstance = anime({
              targets: '.loading-title span',
              y: [
                { value: '-2.75rem', duration: 1500, easing: 'easeOutExpo' }, // Increased from 1200ms
                { value: 0, duration: 2000, delay: 300, easing: 'easeOutBounce' } // Increased from 1600ms, delay from 200ms
              ],
              rotate: {
                value: '-1turn',
                duration: 1500, // Increased from 1200ms
                easing: 'easeInOutCirc'
              },
              delay: (el, i) => i * 150, // Increased from 100ms
              loop: true,
              loopDelay: 3000 // Increased from 2000ms
            });
          } catch (error) {
            console.error("Animation setup error:", error);
          }
        }
      }, 300);
      
      return () => {
        if (animeInstance) {
          animeInstance.pause();
        }
      };
    };
    
    const cleanupVideo = setupVideos();
    const cleanupLoading = setupLoading();
    const cleanupAnimation = setupAnimation();
    
    // Cleanup all effects
    return () => {
      isMounted = false;
      cleanupVideo();
      cleanupLoading();
      cleanupAnimation();
      
      // Pause any playing videos
      videoRefs.current.forEach(ref => {
        if (ref && ref.pause) {
          ref.pause();
        }
      });
    };
  }, [onLoadingComplete]);
  
  // Safe cross-fade between videos
  const crossFadeToVideo = (fromIndex, toIndex) => {
    const fromVideo = videoRefs.current[fromIndex];
    const toVideo = videoRefs.current[toIndex];
    
    if (!fromVideo || !toVideo) return;
    
    try {
      if (toIndex === 1) {
        toVideo.playbackRate = 2.0;
      }
      
      toVideo.play().catch(err => console.error(`Error playing video ${toIndex}:`, err));
      toVideo.classList.add('visible');
      fromVideo.classList.add('fading');
      
      setTimeout(() => {
        if (fromVideo) {
          fromVideo.classList.remove('visible');
          fromVideo.classList.remove('fading');
        }
      }, 1500);
    } catch (error) {
      console.error(`Error in crossFade(${fromIndex}, ${toIndex}):`, error);
    }
  };
  
  return (
    <div ref={containerRef} className="loading-screen">
      <div className="video-container">
        {[vid1, vid2, vid3].map((src, index) => (
          <video
            key={index}
            ref={el => videoRefs.current[index] = el}
            className="loading-video"
            muted
            playsInline
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>
      
      <div className="loading-overlay">
        <div className="loading-content">
          <h1 ref={titleContainerRef} className="loading-title">
            <span>C</span><span>H</span><span>A</span><span>R</span><span>G</span><span>E</span>
            <span> </span>
            <span>T</span><span>R</span><span>A</span><span>C</span><span>K</span>
          </h1>
          <div className="loading-bar-container">
            <div
              className="loading-bar"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="loading-status">LOADING {Math.floor(loadingProgress)}%</div>
          <div className="loading-tip">
            <p>TIP: Always check the ChargeTrack app before driving to a station.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

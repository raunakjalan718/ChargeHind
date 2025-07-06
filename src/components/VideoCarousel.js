import React, { useState, useEffect, useRef } from 'react';
import './VideoCarousel.css';

// Import your videos - adjust paths as needed
import vid1 from '../assets/videos/vid1.mp4';
import vid2 from '../assets/videos/vid2.mp4';
import vid3 from '../assets/videos/vid3.mp4';

const videos = [vid1, vid2, vid3];

function VideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef(videos.map(() => React.createRef()));
  const timeoutRef = useRef(null);
  
  // Handle video transitions
  useEffect(() => {
    // Function to safely play videos with error handling
    const safePlay = async (videoElement) => {
      try {
        // Check if video is ready
        if (videoElement.readyState >= 2) {
          await videoElement.play();
        } else {
          // If not ready, wait for it
          videoElement.addEventListener('canplay', async () => {
            try {
              await videoElement.play();
            } catch (err) {
              console.log("Video play error after canplay:", err);
            }
          }, { once: true });
        }
      } catch (err) {
        console.log("Initial video play error:", err);
      }
    };
    
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Setup all videos
    videos.forEach((_, index) => {
      const videoEl = videoRefs.current[index].current;
      if (videoEl) {
        // Pause all videos first
        videoEl.pause();
        
        // Only try to play the active video
        if (index === activeIndex) {
          videoEl.currentTime = 0;
          safePlay(videoEl);
        }
      }
    });
    
    // Set up the next video transition
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 7000); // Show each video for 7 seconds
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeIndex]);
  
  return (
    <div className="video-carousel">
      {videos.map((video, index) => (
        <div 
          key={`video-container-${index}`}
          className={`video-container ${index === activeIndex ? 'active' : ''}`}
        >
          <video
            ref={videoRefs.current[index]}
            className="carousel-video"
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      ))}
      <div className="video-overlay"></div>
    </div>
  );
}

export default VideoCarousel;

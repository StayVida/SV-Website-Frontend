import { useState, useEffect } from 'react';

const IntroLoader = ({ children }: { children: React.ReactNode }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [swipeUp, setSwipeUp] = useState(false);

  useEffect(() => {
    const isViewed = sessionStorage.getItem('isViewed');
    if (isViewed) {
      setShowLoader(false);
    } else {
      // Prevent scrolling while loader is active
      document.body.style.overflow = 'hidden';
    }
    
    // Cleanup in case component unmounts unexpectedly
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleVideoEnd = () => {
    setSwipeUp(true);
    sessionStorage.setItem('isViewed', 'true');
    // Wait for the swipe-up animation to finish before removing the loader completely
    setTimeout(() => {
      setShowLoader(false);
      document.body.style.overflow = 'auto';
    }, 1000); // Matches the duration of the transition
  };

  // After the loader has finished and been removed, just render the app normally
  if (!showLoader) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Background content (the website) - visible underneath when video swipes up */}
      <div className="relative z-0">
        {children}
      </div>

      {/* Video Loader Overlay */}
      <div
        className={`fixed inset-0 z-[9999] bg-black transition-transform duration-1000 ease-in-out ${
          swipeUp ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <video
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
        >
          <source src="/video/loaderVideo.webm" type="video/webm" />
        </video>
      </div>
    </>
  );
};

export default IntroLoader;

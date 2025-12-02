import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getImageUrl, type SessionResponse } from '../api';

type Phase = 'buffer' | 'drawing';

export const SessionScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session as SessionResponse;

  // Redirect if no session data
  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('buffer');
  const [timeLeft, setTimeLeft] = useState(3); // Start with 3s buffer
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Main timer logic
  useEffect(() => {
    if (!session) return;

    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time is up for current phase
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIndex, isPaused, session]);

  const handlePhaseTransition = () => {
    if (phase === 'buffer') {
      // Buffer finished -> Start drawing
      setPhase('drawing');
      setTimeLeft(session.duration);
    } else {
      // Drawing finished -> Next image or finish
      if (currentIndex < session.images.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setPhase('buffer');
        setTimeLeft(3);
      } else {
        navigate('/summary');
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        // Skip current image
        handlePhaseTransition();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentIndex, session]); 

  if (!session) return null;

  const currentImage = session.images[currentIndex];
  const totalImages = session.images.length;

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Progress Bar (only during drawing) */}
      {phase === 'drawing' && (
        <div className="w-full h-2 bg-gray-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / session.duration) * 100}%` }}
          />
        </div>
      )}

      {/* Status Bar & Last 5s Countdown */}
      <div className="absolute top-4 inset-x-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="text-white bg-black/50 px-3 py-1 rounded text-sm">
          Image {currentIndex + 1} / {totalImages} | {phase === 'buffer' ? 'Get Ready' : 'Draw!'}
        </div>
        
        <div className="flex flex-col items-end gap-2">
           {isPaused && (
            <div className="text-white bg-red-600 px-3 py-1 rounded font-bold">
              PAUSED
            </div>
          )}
          
          {/* Last 5 Seconds Warning - Top Right */}
          {phase === 'drawing' && timeLeft <= 5 && timeLeft > 0 && (
             <div className="text-6xl font-bold text-red-500 drop-shadow-lg animate-pulse">
              {timeLeft}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {/* Image */}
        <img 
          src={getImageUrl(currentImage)} 
          alt="Sketch reference" 
          className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${phase === 'buffer' ? 'opacity-50 blur-sm' : 'opacity-100'}`}
        />

        {/* Overlays */}
        
        {/* Buffer Countdown */}
        {phase === 'buffer' && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="text-9xl font-bold text-white drop-shadow-lg animate-pulse">
              {timeLeft}
            </span>
          </div>
        )}
      </div>
      
      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center z-30 hover:opacity-100 opacity-0 transition-opacity duration-300">
        <button 
          onClick={() => setIsPaused(prev => !prev)}
          className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 border border-white/30"
        >
          {isPaused ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Resume
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pause
            </>
          )}
        </button>
      </div>
    </div>
  );
};

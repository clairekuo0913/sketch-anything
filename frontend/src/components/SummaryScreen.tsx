import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Session Complete!</h1>
        <p className="text-xl text-gray-600 mb-8">Great job practicing.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
};


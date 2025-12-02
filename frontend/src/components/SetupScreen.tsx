import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, startSession } from '../api';

export const SetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>('');
  // Use string state for inputs to allow temporary empty states while typing
  const [durationInput, setDurationInput] = useState<string>('60');
  const [countInput, setCountInput] = useState<string>('10');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(data);
        if (data.length > 0) setCategory(data[0]);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not load categories. Is the backend running?");
        setLoading(false);
      });
  }, []);

  const handleNumberInput = (value: string, setter: (val: string) => void) => {
    // Allow empty string or digits only
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = parseInt(durationInput);
    const count = parseInt(countInput);

    if (!duration || duration < 1) {
      setError("Duration must be at least 1 second");
      return;
    }
    if (!count || count < 1) {
      setError("Number of images must be at least 1");
      return;
    }

    setSubmitting(true);
    try {
      const session = await startSession({ category, count, duration });
      // Navigate to session with state
      navigate('/session', { state: { session } });
    } catch (err) {
      setError("Failed to start session.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sketch Anything</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds per image)</label>
            <input 
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={durationInput} 
              onChange={(e) => handleNumberInput(e.target.value, setDurationInput)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Images</label>
            <input 
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={countInput} 
              onChange={(e) => handleNumberInput(e.target.value, setCountInput)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 10"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting || categories.length === 0}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {submitting ? 'Starting...' : 'Start Sketching'}
          </button>
        </form>
      </div>
    </div>
  );
};

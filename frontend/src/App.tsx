import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SetupScreen } from './components/SetupScreen';
import { SessionScreen } from './components/SessionScreen';
import { SummaryScreen } from './components/SummaryScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetupScreen />} />
        <Route path="/session" element={<SessionScreen />} />
        <Route path="/summary" element={<SummaryScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

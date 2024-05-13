import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './main';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

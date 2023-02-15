import { Routes, Route, Navigate } from 'react-router-dom';
import ComicsPage from '../../pages/comics/ComicsPage';
import HomePage from '../../pages/home/HomePage';

import AppHeader from '../appHeader/AppHeader';

const App = () => {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comics" element={<ComicsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

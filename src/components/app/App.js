import { Routes, Route } from 'react-router-dom';
import ComicsPage from '../../pages/comicsPage/ComicsPage';
import Page404 from '../../pages/Page404/Page404';
import HomePage from '../../pages/homePage/HomePage';

import AppHeader from '../appHeader/AppHeader';
import SingleComicPage from '../../pages/singleComicPage/SingleComicPage';

const App = () => {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comics" element={<ComicsPage />} />
          <Route path="/comics/:id" element={<SingleComicPage />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

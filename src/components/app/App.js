import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import AppHeader from '../appHeader/AppHeader';
import Spinner from '../spinner/Spinner';

const ComicsPage = lazy(() => import('../../pages/comicsPage/ComicsPage'));
const Page404 = lazy(() => import('../../pages/Page404/Page404'));
const HomePage = lazy(() => import('../../pages/homePage/HomePage'));

const SingleComicPage = lazy(() =>
  import('../../pages/singleComicPage/SingleComicPage')
);

const App = () => {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/comics" element={<ComicsPage />} />
            <Route path="/comics/:id" element={<SingleComicPage />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;

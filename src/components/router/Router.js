import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Spinner from '../spinner/Spinner';
import { SwitchTransition } from 'react-transition-group';

const ComicsPage = lazy(() => import('../../pages/comicsPage/ComicsPage'));
const Page404 = lazy(() => import('../../pages/Page404/Page404'));
const HomePage = lazy(() => import('../../pages/homePage/HomePage'));

const SingleComicPage = lazy(() =>
  import('../../pages/singleComicPage/SingleComicPage')
);

const AplicationRouter = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <SwitchTransition component={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comics" element={<ComicsPage />} />
          <Route path="/comics/:id" element={<SingleComicPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </SwitchTransition>
    </Suspense>
  );
};

export default AplicationRouter;

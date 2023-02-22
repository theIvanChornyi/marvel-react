import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Error from '../../components/error/Error';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary';
import SingleComic from '../../components/singleComic/SingleComic';
import Spinner from '../../components/spinner/Spinner';
import AppBanner from '../../components/appBanner/AppBanner';

import { stateMachine } from '../../helpers/stateMachine';
import { useMarvelAPI } from '../../services/marvelAPI';
import { Helmet } from 'react-helmet';

const SingleComicPage = () => {
  const { id } = useParams();
  const { state, getComicById } = useMarvelAPI();
  const [comic, setComic] = useState(null);

  useEffect(() => {
    getComicsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getComicsInfo = async () => {
    const validId = Number.parseInt(id);
    const resp = await getComicById(validId);
    setComic(resp);
  };

  return (
    <>
      <Helmet>
        <meta name="description" content={`Info about ${comic?.title}`} />
        <title>{`${comic?.title} info`}</title>
      </Helmet>
      <AppBanner />
      {state === stateMachine.rejected && <Error />}
      {state === stateMachine.load && (
        <div
          style={{
            marginTop: '25%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </div>
      )}
      {state === stateMachine.success && (
        <ErrorBoundary>
          <SingleComic {...{ comic }} />
        </ErrorBoundary>
      )}
    </>
  );
};

export default SingleComicPage;

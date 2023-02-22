import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Error from '../../components/error/Error';
import AppBanner from '../../components/appBanner/AppBanner';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary';
import SingleChar from '../../components/singleChar/SingleChar';
import Spinner from '../../components/spinner/Spinner';
import { stateMachine } from '../../helpers/stateMachine';
import { useMarvelAPI } from '../../services/marvelAPI';
import { Helmet } from 'react-helmet';

const SingleCharPage = () => {
  const { id } = useParams();
  const { state, getCharacterByID } = useMarvelAPI();
  const { state: charFromHomePage } = useLocation();

  const [char, setChar] = useState(() => charFromHomePage || null);
  useEffect(() => {
    if (!char) getComicsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getComicsInfo = async () => {
    const validId = Number.parseInt(id);
    const resp = await getCharacterByID(validId);
    setChar(resp);
  };

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={`Info about ${char?.name} character`}
        />
        <title>{`${char?.name} page`}</title>
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
      {(state === stateMachine.success || char) && (
        <ErrorBoundary>
          <SingleChar {...{ char }} />
        </ErrorBoundary>
      )}
    </>
  );
};

export default SingleCharPage;

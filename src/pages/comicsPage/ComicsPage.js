import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import AppBanner from '../../components/appBanner/AppBanner';
import ComicsList from '../../components/comicsList/ComicsList';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary';
import { stateMachine } from '../../helpers/stateMachine';
import { useMarvelAPI } from '../../services/marvelAPI';

const ComicsPage = () => {
  const { getComicsData, state } = useMarvelAPI();
  const [comics, setComics] = useState([]);

  const [uploadFirs, setUploadFirst] = useState(stateMachine.pending);
  const [offset, setOffset] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    getComics();
    window.addEventListener('scroll', debounce(onScrollDown, 300));
    return () => {
      window.removeEventListener('scroll', debounce(onScrollDown, 300));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getComics = async () => {
    setUploadFirst(stateMachine.load);

    try {
      const resp = await getComicsData();
      setComics(resp);
      setUploadFirst(stateMachine.success);
    } catch (error) {
      setUploadFirst(stateMachine.rejected);
    }
  };

  useEffect(() => {
    if (offset > 0) {
      uploadNewComics(offset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const onScrollDown = () => {
    if (
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 2
    ) {
      changeOffset();
    }
  };

  const uploadNewComics = async offset => {
    try {
      const newComics = await getComicsData(offset);
      if (newComics.length < 8) setIsEnd(true);
      setComics(comics => [...comics, ...newComics]);
    } catch (e) {
      console.log(e);
    }
  };

  const changeOffset = useCallback(() => {
    setOffset(p => (p += 8));
  }, []);

  return (
    <>
      <AppBanner />
      <ErrorBoundary>
        <ComicsList {...{ comics, uploadFirs, isEnd, changeOffset, state }} />
      </ErrorBoundary>
    </>
  );
};
export default ComicsPage;

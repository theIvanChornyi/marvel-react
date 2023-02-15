import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarvelAPI } from '../../services/marvelAPI';
import { stateMachine } from '../../helpers/stateMachine';
import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import debounce from 'lodash.debounce';

const ComicsList = () => {
  const { getComicsData, state, error } = useMarvelAPI();
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

  const comicsItems = useMemo(() => {
    return comics.map(({ id, title, price, pictureUrl }) => (
      <li className="comics__item" key={id}>
        <Link to={`${id}`}>
          <img
            src={pictureUrl}
            alt="ultimate war"
            className="comics__item-img"
          />
          <div className="comics__item-name">{title}</div>
          <div className="comics__item-price">{price}$</div>
        </Link>
      </li>
    ));
  }, [comics]);

  return (
    <div className="comics__list">
      {uploadFirs === stateMachine.load && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spinner />
        </div>
      )}
      {uploadFirs === stateMachine.rejected && <Error />}
      {uploadFirs === stateMachine.success && (
        <>
          <ul className="comics__grid"> {comicsItems}</ul>
          {!isEnd && (
            <button
              onClick={changeOffset}
              disabled={state === stateMachine.load}
              className="button button__main button__long"
            >
              <div className="inner">load more</div>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ComicsList;

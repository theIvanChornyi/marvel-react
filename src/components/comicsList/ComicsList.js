import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { stateMachine } from '../../helpers/stateMachine';
import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

const ComicsList = ({ comics, uploadFirs, isEnd, changeOffset, state }) => {
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
          <div className="comics__item-price">{price}</div>
        </Link>
      </li>
    ));
  }, [comics]);

  return (
    <div className="comics__list">
      {uploadFirs === stateMachine.load && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '25%',
          }}
        >
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

ComicsList.propTypes = {
  comics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      price: PropTypes.number,
      pictureUrl: PropTypes.string,
    })
  ),
  uploadFirs: PropTypes.string,
  isEnd: PropTypes.bool,
  changeOffset: PropTypes.func,
  state: PropTypes.string,
};

export default ComicsList;

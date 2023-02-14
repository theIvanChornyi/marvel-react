import './charList.scss';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import { clsx } from 'clsx';

import debounce from 'lodash.debounce';

import MarvelAPI from '../../services/marvelAPI';

const stateMachine = {
  pending: 'pending',
  load: 'load',
  success: 'success',
  rejected: 'rejected',
};

const CharList = ({ updateCharId }) => {
  const [chars, setChars] = useState([]);
  const [state, setState] = useState(stateMachine.pending);
  const [active, setActive] = useState(null);

  const [uploadNew, setUploadNew] = useState(stateMachine.pending);
  const [offset, setOffset] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    getChars();
    window.addEventListener('scroll', debounce(onScrollDown, 300));
    return () => {
      window.removeEventListener('scroll', debounce(onScrollDown, 300));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (offset > 0) {
      uploadNewChars(offset);
    }
  }, [offset]);

  const onScrollDown = () => {
    if (
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 2
    ) {
      changeOffset();
    }
  };

  const selectChar = useCallback(
    id => {
      setActive(id);
      updateCharId(id);
    },
    [updateCharId]
  );

  const changeOffset = useCallback(() => {
    setOffset(p => (p += 9));
  }, []);

  const getChars = async () => {
    setState(stateMachine.load);
    try {
      const chars = await MarvelAPI.getCharacters();
      setChars(chars);
      setState(stateMachine.success);
    } catch (e) {
      console.log(e);
      setState(stateMachine.rejected);
    }
  };

  const uploadNewChars = async offset => {
    setUploadNew(stateMachine.load);
    try {
      const newChars = await MarvelAPI.getCharacters(offset);
      if (newChars.length < 9) setIsEnd(true);
      setChars(chars => [...chars, ...newChars]);
      setUploadNew(stateMachine.success);
    } catch (e) {
      console.log(e);
      setUploadNew(stateMachine.rejected);
    }
  };

  return (
    <>
      {state === stateMachine.load && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spinner />
        </div>
      )}
      {state === stateMachine.rejected && <Error />}
      {state === stateMachine.success && (
        <View
          {...{
            chars,
            active,
            selectChar: selectChar,
            changeOffset: changeOffset,
            isEnd,
            uploadNew,
          }}
        />
      )}
    </>
  );
};

const View = ({
  chars,
  active,
  selectChar,
  changeOffset,
  uploadNew,
  isEnd,
}) => (
  <div className="char__list">
    <ul className="char__grid">
      {chars.map(({ pictureUrl, name, id }) => (
        <li
          onClick={() => selectChar(id)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              selectChar(id);
            }
          }}
          key={id}
          tabIndex="0"
          className={clsx(
            'char__item',
            +id === +active && 'char__item_selected'
          )}
        >
          <img
            loading="lazy"
            src={pictureUrl}
            alt={name + 'photo'}
            style={
              pictureUrl && pictureUrl.includes('image_not_available')
                ? {
                    objectFit: 'unset',
                  }
                : null
            }
          />
          <div className="char__name">{name}</div>
        </li>
      ))}
    </ul>
    {!isEnd && (
      <button
        disabled={uploadNew === stateMachine.load}
        onClick={changeOffset}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    )}
  </div>
);

View.propTypes = {
  chars: PropTypes.arrayOf(
    PropTypes.shape({
      pictureUrl: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.number,
    })
  ),
  active: PropTypes.number,
  selectChar: PropTypes.func,
  changeOffset: PropTypes.func,
  uploadNew: PropTypes.string,
  isEnd: PropTypes.bool,
};

CharList.propTypes = {
  updateCharId: PropTypes.func.isRequired,
};

export default CharList;

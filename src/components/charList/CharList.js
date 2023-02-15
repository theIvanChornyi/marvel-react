import './charList.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import { clsx } from 'clsx';

import debounce from 'lodash.debounce';
import { useMarvelAPI } from '../../services/marvelAPI';

const stateMachine = {
  pending: 'pending',
  load: 'load',
  success: 'success',
  rejected: 'rejected',
};

const CharList = ({ updateCharId }) => {
  const { state, getCharacters } = useMarvelAPI();

  const [chars, setChars] = useState([]);
  const [active, setActive] = useState(null);

  const [uploadFirs, setUploadFirst] = useState(stateMachine.pending);
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
    setUploadFirst(stateMachine.load);

    try {
      const chars = await getCharacters();
      setChars(chars);
      setUploadFirst(stateMachine.success);
    } catch (e) {
      console.log(e);
      setUploadFirst(stateMachine.rejected);
    }
  };

  const uploadNewChars = async offset => {
    try {
      const newChars = await getCharacters(offset);
      if (newChars.length < 9) setIsEnd(true);
      setChars(chars => [...chars, ...newChars]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {uploadFirs === stateMachine.load && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spinner />
        </div>
      )}
      {uploadFirs === stateMachine.rejected && <Error />}
      {uploadFirs === stateMachine.success && (
        <View
          {...{
            chars,
            active,
            selectChar: selectChar,
            changeOffset: changeOffset,
            isEnd,
            state,
          }}
        />
      )}
    </>
  );
};

const View = ({ chars, active, selectChar, changeOffset, state, isEnd }) => {
  const charsItems = useMemo(() => {
    return chars.map(({ pictureUrl, name, id }) => (
      <li
        onClick={() => selectChar(id)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            selectChar(id);
          }
        }}
        key={id}
        tabIndex="0"
        className={clsx('char__item', +id === +active && 'char__item_selected')}
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
    ));
  }, [chars, active]);

  return (
    <div className="char__list">
      <ul className="char__grid">{charsItems}</ul>
      {!isEnd && (
        <button
          disabled={state === stateMachine.load}
          onClick={changeOffset}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      )}
    </div>
  );
};

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

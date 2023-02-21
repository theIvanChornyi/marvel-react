import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './charInfo.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';
import { useMarvelAPI } from '../../services/marvelAPI';

import { stateMachine } from '../../helpers/stateMachine';
import { Link } from 'react-router-dom';

const CharInfo = ({ charId }) => {
  const { getCharacterByID, state } = useMarvelAPI();

  const [char, setChar] = useState(null);

  useEffect(() => {
    charId && getCharInfo(charId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charId]);

  const getCharInfo = async id => {
    try {
      const char = await getCharacterByID(id);
      setChar(char);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="char__info">
      {state === stateMachine.pending && <Skeleton />}
      {state === stateMachine.load && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spinner />
        </div>
      )}
      {state === stateMachine.rejected && <Error />}
      {state === stateMachine.success && <View {...char} />}
    </div>
  );
};

const View = ({ name, homepage, wiki, description, pictureUrl, comics }) => (
  <>
    <div className="char__basics">
      {pictureUrl && (
        <img
          src={pictureUrl}
          alt={name + 'avatar'}
          loading="lazy"
          style={
            pictureUrl && pictureUrl.includes('image_not_available')
              ? {
                  objectFit: 'unset',
                }
              : null
          }
        />
      )}
      <div>
        <div className="char__info-name">{name}</div>
        <div className="char__btns">
          <a
            href={homepage}
            target="_blank"
            rel="noreferrer"
            className="button button__main"
          >
            <div className="inner">homepage</div>
          </a>
          <a
            href={wiki}
            target="_blank"
            rel="noreferrer"
            className="button button__secondary"
          >
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
    <div className="char__descr">{description}</div>

    <div className="char__comics">Comics:</div>
    {comics?.length > 0 ? (
      <ul className="char__comics-list">
        {[...comics]
          .map(({ name, resourceURI }, i) => (
            <li className="char__comics-item" key={i}>
              <Link to={`comics/${resourceURI.split('/').reverse()[0]}`}>
                {name}
              </Link>
            </li>
          ))
          .splice(0, 10)}
      </ul>
    ) : (
      'There is no comics with this character'
    )}
  </>
);

View.propTypes = {
  name: PropTypes.string,
  homepage: PropTypes.string,
  wiki: PropTypes.string,
  description: PropTypes.string,
  pictureUrl: PropTypes.string,
  comics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
};
CharInfo.propTypes = { charId: PropTypes.number };

export default CharInfo;

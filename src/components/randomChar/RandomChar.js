import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { useEffect, useState } from 'react';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

import MarvelAPI from '../../services/marvelAPI';

const stateMachine = {
  pending: 'pending',
  load: 'load',
  success: 'success',
  rejected: 'rejected',
};

const RandomChar = () => {
  const [char, setChar] = useState(null);
  const [state, setState] = useState(stateMachine.pending);

  useEffect(() => {
    getRandomCharacter();
  }, []);

  const getRandomCharacter = async () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    setState(stateMachine.load);

    try {
      const char = await MarvelAPI.getCharacterByID(id);
      setChar(char);
      setState(stateMachine.success);
    } catch (error) {
      setState(stateMachine.rejected);
    }
  };

  const descriptionNormalize = string => {
    return string.length < 200 ? string : `${string.slice(0, 200)}...`;
  };

  return (
    <div className="randomchar">
      {state === stateMachine.load && <Spinner />}
      {state === stateMachine.rejected && <Error />}
      {state === stateMachine.success && (
        <div className="randomchar__block">
          <img
            loading="lazy"
            src={char.pictureUrl}
            style={
              char.pictureUrl && char.pictureUrl.includes('image_not_available')
                ? {
                    objectFit: 'unset',
                  }
                : null
            }
            alt="Random character"
            className="randomchar__img"
          />
          <div className="randomchar__info">
            <p className="randomchar__name">{char.name}</p>
            <p className="randomchar__descr">
              {descriptionNormalize(char.description)}
            </p>
            <div className="randomchar__btns">
              <a href={char.homepage} className="button button__main">
                <div className="inner">homepage</div>
              </a>
              <a href={char.wiki} className="button button__secondary">
                <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
      )}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button
          className="button button__main"
          onClick={() => getRandomCharacter()}
        >
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

export default RandomChar;

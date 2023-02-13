import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

import MarvelAPI from '../../services/marvelAPI';

const stateMachine = {
  pending: 'pending',
  load: 'load',
  success: 'success',
  rejected: 'rejected',
};

class RandomChar extends Component {
  state = {
    char: {},
    state: stateMachine.pending,
  };

  componentDidMount() {
    this.getRandomCharacter();
  }

  componentDidUpdate(_, prevState) {
    if (this.state.updating !== prevState.updating) {
      this.getRandomCharacter();
    }
  }

  getRandomCharacter = async () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.setState({ state: stateMachine.load });
    try {
      const char = await MarvelAPI.getCharacterByID(id);
      this.setState({ state: stateMachine.success });
      this.setState({ char });
    } catch (error) {
      this.setState({ state: stateMachine.rejected });
    }
  };

  descriptionNormalize = string => {
    return string.length < 200 ? string : `${string.slice(0, 200)}...`;
  };

  render() {
    const { state, char } = this.state;
    const {
      pictureUrl,
      name = '',
      description = 'Nothing is known about this character.',
      homepage = '#',
      wiki = '#',
    } = char;
    return (
      <div className="randomchar">
        {state === stateMachine.load && <Spinner />}
        {state === stateMachine.rejected && <Error />}
        {state === stateMachine.success && (
          <div className="randomchar__block">
            <img
              loading="lazy"
              src={pictureUrl}
              style={
                pictureUrl && pictureUrl.includes('image_not_available')
                  ? {
                      objectFit: 'unset',
                    }
                  : null
              }
              alt="Random character"
              className="randomchar__img"
            />
            <div className="randomchar__info">
              <p className="randomchar__name">{name}</p>
              <p className="randomchar__descr">
                {this.descriptionNormalize(description)}
              </p>
              <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                  <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
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
            onClick={() => this.getRandomCharacter()}
          >
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

export default RandomChar;

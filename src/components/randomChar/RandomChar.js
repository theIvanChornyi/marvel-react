import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';

import MarvelAPI from '../../services/marvelAPI';

class RandomChar extends Component {
  state = {
    char: {},
  };

  getRandomCharacter = async () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    const char = await MarvelAPI.getCharacterByID(id);
    this.setState({ char });
  };

  descriptionNormalize = string => {
    return string.length < 200 ? string : `${string.slice(0, 200)}...`;
  };
  componentDidMount() {
    this.getRandomCharacter();
  }
  render() {
    const {
      pictureUrl,
      name = '',
      description = 'Nothing is known about this character.',
      homepage = '#',
      wiki = '#',
    } = this.state.char;
    return (
      <div className="randomchar">
        <div className="randomchar__block">
          <img
            src={pictureUrl}
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
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

export default RandomChar;

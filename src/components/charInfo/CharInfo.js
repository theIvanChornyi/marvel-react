import { Component } from 'react';

import './charInfo.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';

import MarvelAPI from '../../services/marvelAPI';

const stateMachine = {
  pending: 'pending',
  load: 'load',
  success: 'success',
  rejected: 'rejected',
};

class CharInfo extends Component {
  state = {
    char: null,
    state: stateMachine.pending,
  };

  componentDidMount() {
    if (this.props.charId) {
      this.getCharInfo(this.props.charId);
    }
  }

  componentDidUpdate(prevProp) {
    if (prevProp.charId !== this.props.charId) {
      this.getCharInfo(this.props.charId);
    }
  }

  getCharInfo = async id => {
    this.setState({ state: stateMachine.load });
    try {
      const char = await MarvelAPI.getCharacterByID(id);
      await this.setState({ char });
      this.setState({ state: stateMachine.success });
    } catch (e) {
      console.log(e);
      this.setState({ state: stateMachine.rejected });
    }
  };

  render() {
    const { state, char } = this.state;
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
  }
}

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
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
    <div className="char__descr">{description}</div>

    <div className="char__comics">Comics:</div>
    {comics.length > 0 ? (
      <ul className="char__comics-list">
        {[...comics]
          .map(({ name }, i) => (
            <li className="char__comics-item" key={i}>
              {name}
            </li>
          ))
          .splice(0, 10)}
      </ul>
    ) : (
      'There is no comics with this character'
    )}
  </>
);

export default CharInfo;

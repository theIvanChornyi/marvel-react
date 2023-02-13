import './charList.scss';
import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import { clsx } from 'clsx';

import MarvelAPI from '../../services/marvelAPI';

const stateMachine = {
  pending: 'pending',
  load: 'load',
  success: 'success',
  rejected: 'rejected',
};

class CharList extends Component {
  state = {
    chars: [],
    state: stateMachine.pending,
    active: '',
  };

  componentDidMount() {
    this.getChars();
  }

  selectChar = id => {
    this.setState({ active: id });
    this.props.updateCharId(id);
  };

  getChars = async () => {
    this.setState({ state: stateMachine.load });
    try {
      const chars = await MarvelAPI.getCharacters();
      this.setState({ chars });
      this.setState({ state: stateMachine.success });
    } catch (e) {
      console.log(e);
      this.setState({ state: stateMachine.rejected });
    }
  };

  render() {
    const { state, chars, active } = this.state;

    return (
      <>
        {state === stateMachine.load && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spinner />
          </div>
        )}
        {state === stateMachine.rejected && <Error />}
        {state === stateMachine.success && (
          <div className="char__list">
            <ul className="char__grid">
              {chars.map(({ pictureUrl, name, id }) => (
                <li
                  onClick={() => this.selectChar(id)}
                  key={id}
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
            <button className="button button__main button__long">
              <div className="inner">load more</div>
            </button>
          </div>
        )}
      </>
    );
  }
}

export default CharList;

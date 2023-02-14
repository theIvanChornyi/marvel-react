import './charList.scss';
import { Component } from 'react';
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

class CharList extends Component {
  state = {
    chars: [],
    state: stateMachine.pending,
    active: null,
    uploadNew: stateMachine.pending,
    offset: 0,
    isEnd: false,
  };

  componentDidMount() {
    this.setState({ offset: 0 });
    this.getChars();

    window.addEventListener(
      'scroll',
      debounce(this.onScrollDown.bind(this), 300)
    );
  }

  componentDidUpdate(_, prevState) {
    if (this.state.offset !== prevState.offset && !this.state.isEnd) {
      this.uploadNewChars(this.state.offset);
    }
  }

  onScrollDown() {
    if (
      this.state.state === stateMachine.success &&
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2
    ) {
      this.changeOffset();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'scroll',
      debounce(this.onScrollDown.bind(this), 300)
    );
  }

  selectChar = id => {
    this.setState({ active: id });
    this.props.updateCharId(id);
  };

  changeOffset = () => {
    this.setState(({ offset }) => ({ offset: (offset += 9) }));
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

  uploadNewChars = async offset => {
    this.setState({ uploadNew: stateMachine.load });
    try {
      const newChars = await MarvelAPI.getCharacters(offset);
      if (newChars.length < 9) this.setState({ isEnd: true });

      this.setState(({ chars }) => ({ chars: [...chars, ...newChars] }));
      this.setState({ uploadNew: stateMachine.success });
    } catch (e) {
      console.log(e);
      this.setState({ uploadNew: stateMachine.rejected });
    }
  };

  render() {
    const { state, chars, active, isEnd, uploadNew } = this.state;
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
              selectChar: this.selectChar,
              changeOffset: this.changeOffset,
              isEnd,
              uploadNew,
            }}
          />
        )}
      </>
    );
  }
}

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
          onFocus={() => selectChar(id)}
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

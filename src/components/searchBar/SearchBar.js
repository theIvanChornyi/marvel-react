import './searchBar.scss';
import { useForm } from 'react-hook-form';
import { useMarvelAPI } from '../../services/marvelAPI';
import { useState } from 'react';
import { stateMachine } from '../../helpers/stateMachine';

import Error from '../error/Error';
import Spinner from '../spinner/Spinner';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [char, setChar] = useState(null);
  let { getCharacterByName, state, error } = useMarvelAPI();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async ({ charname }) => {
    const res = await getCharacterByName(charname);
    setChar(res);
    reset();
  };

  const onHandleClick = () =>
    navigate(`/char/${char.id}`, {
      state: char,
    });

  return error ? (
    <Error />
  ) : (
    <div className="search-bar">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="search-bar__title">
          Or find a character by name:
        </label>
        <div className="search-bar__wrapper">
          <input
            id="name"
            className="search-bar__input"
            type="text"
            placeholder="Enter name"
            {...register('charname', { required: true })}
          />
          <button className="button button__main">
            <div className="inner">FIND</div>
          </button>
        </div>
      </form>
      {errors.charname && (
        <div className="notification">
          <span className="notification__text notification__text--error ">
            This field is required
          </span>
        </div>
      )}
      {!errors.charname && state === stateMachine.load && (
        <div className="search-bar__spinner">
          <Spinner />
        </div>
      )}
      {!errors.charname &&
        !watch('charname') &&
        state === stateMachine.success && (
          <div className="notification">
            {char && (
              <>
                <span className="notification__text notification__text--success ">{`There is! Visit ${char.name} page?`}</span>

                <button
                  onClick={onHandleClick}
                  type="button"
                  className="button button__secondary"
                >
                  <div className="inner">TO PAGE</div>
                </button>
              </>
            )}
            {!char && (
              <span className="notification__text notification__text--error ">
                {'The character was not found. Check the name and try again'}
              </span>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchBar;

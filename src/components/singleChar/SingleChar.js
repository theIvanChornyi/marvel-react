import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './singleChar.scss';

const SingleChar = ({ char }) => {
  const { name, pictureUrl, description } = char;
  return (
    <div className="single-comic">
      <img
        src={pictureUrl}
        alt={`${name} avatar`}
        className="single-comic__img"
      />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{name}</h2>
        <p className="single-comic__descr">{description}</p>
      </div>
      <Link to={-1} className="single-comic__back">
        Back to all
      </Link>
    </div>
  );
};

SingleChar.propTypes = {
  pictureUrl: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
};

export default SingleChar;

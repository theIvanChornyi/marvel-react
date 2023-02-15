import PropTypes from 'prop-types';

import './singleComic.scss';
import { Link } from 'react-router-dom';

const SingleComic = ({ comic }) => {
  const { price, pictureUrl, title, pageCount, description, language } = comic;
  return (
    <div className="single-comic">
      <img src={pictureUrl} alt="x-men" className="single-comic__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__descr">{description}</p>
        <p className="single-comic__descr">{pageCount}</p>
        <p className="single-comic__descr">{language}</p>
        <div className="single-comic__price">{price}</div>
      </div>
      <Link to={-1} className="single-comic__back">
        Back to all
      </Link>
    </div>
  );
};
SingleComic.propTypes = {
  price: PropTypes.number,
  pictureUrl: PropTypes.string,
  title: PropTypes.string,
  pageCount: PropTypes.number,
  description: PropTypes.string,
};
export default SingleComic;

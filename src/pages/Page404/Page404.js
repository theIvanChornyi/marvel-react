import { Link } from 'react-router-dom';
import Error from '../../components/error/Error';
import './page404.scss';

const Page404 = () => {
  return (
    <div className="page404">
      <h2 className="page404__title">404</h2>
      <h3>THIS PAGE IS NOT FOUND</h3>
      <Error />
      <Link className="button button__main" to="/">
        <div className="inner">Go home page</div>
      </Link>
    </div>
  );
};
export default Page404;

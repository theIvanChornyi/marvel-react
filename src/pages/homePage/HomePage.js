import CharContent from '../../components/charContent/CharContent';
import { Helmet } from 'react-helmet';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary';
import RandomChar from '../../components/randomChar/RandomChar';
import decoration from '../../resources/img/vision.png';

const HomePage = () => (
  <>
    <Helmet>
      <meta name="description" content="Marvel information portal" />
      <title>Marvel information portal</title>
    </Helmet>
    <ErrorBoundary>
      <RandomChar />
    </ErrorBoundary>
    <CharContent />
    <img className="bg-decoration" src={decoration} alt="vision" />
  </>
);

export default HomePage;

import CharContent from '../../components/charContent/CharContent';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary';
import RandomChar from '../../components/randomChar/RandomChar';
import decoration from '../../resources/img/vision.png';

const HomePage = () => (
  <>
    <ErrorBoundary>
      <RandomChar />
    </ErrorBoundary>
    <CharContent />
    <img className="bg-decoration" src={decoration} alt="vision" />
  </>
);

export default HomePage;

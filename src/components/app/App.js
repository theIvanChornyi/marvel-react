import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';

import decoration from '../../resources/img/vision.png';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import CharContent from '../charContent/CharContent';

const App = () => {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <ErrorBoundary>
          <RandomChar />
        </ErrorBoundary>
        <CharContent />
        <img className="bg-decoration" src={decoration} alt="vision" />
      </main>
    </div>
  );
};

export default App;

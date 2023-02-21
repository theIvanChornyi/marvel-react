import AppHeader from '../appHeader/AppHeader';
import AplicationRouter from '../router/Router';

const App = () => {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <AplicationRouter />
      </main>
    </div>
  );
};

export default App;

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';

import decoration from '../../resources/img/vision.png';

import MarvelAPI from '../../services/marvelAPI';

const App = () => {
  //   console.log(process.env);
  MarvelAPI.getCharacters().then(r => console.log('r', r.results));
  MarvelAPI.getCharacterByID(1011334).then(r => console.log('r', r.results));

  return (
    <div className="app">
      <AppHeader />
      <main>
        <RandomChar />
        <div className="char__content">
          <CharList />
          <CharInfo />
        </div>
        <img className="bg-decoration" src={decoration} alt="vision" />
      </main>
    </div>
  );
};

export default App;

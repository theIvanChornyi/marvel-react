import { useCallback, useState } from 'react';
import CharInfo from '../charInfo/CharInfo';
import CharList from '../charList/CharList';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import SearchBar from '../searchBar/SearchBar';
import './charContent.scss';

const CharContent = () => {
  const [charId, setCharId] = useState(null);

  const updateCharId = useCallback(charId => {
    setCharId(charId);
  }, []);

  return (
    <div className="char__content">
      <ErrorBoundary>
        <CharList updateCharId={updateCharId} />
      </ErrorBoundary>
      <div className="char__info-wrapper">
        <ErrorBoundary>
          <CharInfo charId={charId} />
        </ErrorBoundary>
        <ErrorBoundary>
          <SearchBar />
        </ErrorBoundary>
      </div>
    </div>
  );
};
export default CharContent;

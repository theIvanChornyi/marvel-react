import { useCallback, useState } from 'react';
import CharInfo from '../charInfo/CharInfo';
import CharList from '../charList/CharList';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
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
      <ErrorBoundary>
        <CharInfo charId={charId} />
      </ErrorBoundary>
    </div>
  );
};
export default CharContent;

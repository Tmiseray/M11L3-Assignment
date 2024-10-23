import { useState } from 'react';
import CharacterList from './components/CharacterList';
import CharacterDetail from './components/CharacterDetail';
import './App.css';

const App = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);

  const handleCharacterSelect = (characterId) => {
    setSelectedCharacterId(characterId);
  };

  const marvelClick = () => {
    window.location.href = "https://www.marvel.com/";
  }

  return (
    <div className='appContainer'>
      <header>
        <h1>Marvel Universe</h1>
          <p>Below You will find every character in the Marvel Universe!</p>
          <p>Click on your favorite character to see further details!</p>
      </header>
      <section>
        <CharacterList handleCharacterSelect={handleCharacterSelect} />
      </section>
      <section className='characterDetailsContainer'>
        <CharacterDetail characterId={selectedCharacterId} />
      </section>
      <footer>
        <button type='button' onClick={marvelClick}>
          <svg className="icon--svg icon--svg mvl-animated-logo"><use xlinkHref="#marvel"/></svg>
        </button>
      </footer>
    </div>
  )
};


export default App;


import axios from 'axios';
import { useEffect, useState } from 'react';
import { publicKey } from './PubKey.js'
import PropTypes from 'prop-types';
import { hash } from './Hash.js';


const CharacterList = ({ handleCharacterSelect }) => {
    const [characters, setCharacters] = useState([]);
    const [currentLetter, setCurrentLetter] = useState('A');
    const [noResultsMessage, setNoResultsMessage] = useState('');
    const [isRefreshing, setRefresh] = useState(false);
    const [error, setError] = useState('');

    const nextLetter = (letter) => {
        return String.fromCharCode(letter.charCodeAt(0) + 1);
    };

    const fetchTotalCharacters = async (letter) => {
        try {
            const response = await axios.get(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${letter}&limit=100&ts=1&apikey=${publicKey}&hash=${hash}`);
            return response.data.data.total;
        } catch (error) {
            console.error('Error fetching total characters:', error);
            return 0;
        }
    };

    const fetchRandomCharacters = async (letter) => {
        const total = await fetchTotalCharacters(letter);
        if (total <1 ) {
            setNoResultsMessage(`No characters available for names starting with "${letter}".`);
            setCharacters([]);
            return;
        }

        setNoResultsMessage('');

        const limit = Math.min(18, total);
        const maxOffset = total - limit;
        const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

        setRefresh(true);

        try {
            const response = await axios.get(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${letter}&limit=${limit}&offset=${randomOffset}&ts=1&apikey=${publicKey}&hash=${hash}`);
            
            const charactersData = response.data.data.results;
            setCharacters(charactersData);
            console.log(charactersData);
            setRefresh(false);
        } catch (error) {
            console.error('Error fetching random characters:', error);
        }
    };

    useEffect(() => {
        const storedLetter = localStorage.getItem('currentLetter') || 'A';
        setCurrentLetter(storedLetter);
        fetchRandomCharacters(storedLetter);
    }, []);

    useEffect(() => {
        localStorage.setItem('currentLetter', currentLetter);
    }, [currentLetter]);

    const handleRefresh = async (event) => {
        event.preventDefault();
        const next = nextLetter(currentLetter);
        if (next <= 'Z') {
            setCurrentLetter(next);
        }
        setRefresh(true);
        setError(null);
        try {
            if (currentLetter) {
                await fetchRandomCharacters(next);
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 12000))
            setRefresh(false);
        } catch (error) {
            setError(error.toString());
            setRefresh(false);
        }
    };

    if (isRefreshing) return <p className='refresh'>Refreshing character data ...</p>;
    if (error) return <p className='error'>Error refreshing character data: {error}</p>;

    return (
        <div className='charactersList'>
            <h2 className='title'>Characters Starting with {currentLetter}</h2>
            <button onClick={handleRefresh}>Refresh for Next Letter</button>
            {noResultsMessage && <p className='noResultsMessage'>{noResultsMessage}</p>}
            <ul className='charactersContainer'>
                {characters.map(character => {
                    return (
                        <li key={character.id} onClick={() => handleCharacterSelect(character.id)}>
                            <img className='imgThumbnail' src={`${character.thumbnail.path}.${character.thumbnail.extension}`.replace('http', 'https')} alt={character.name} />
                            <h3 className='characterName'>{character.name}</h3>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
};

CharacterList.propTypes = {
    handleCharacterSelect: PropTypes.func.isRequired
};

export default CharacterList;
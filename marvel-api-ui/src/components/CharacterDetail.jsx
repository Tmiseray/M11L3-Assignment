
import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { publicKey } from './PubKey.js';
import { hash } from './Hash.js';


const CharacterDetail = ({ characterId }) => {
    const [character, setCharacter] = useState([]);
    const [isFetching, setFetch] = useState(false);
    const [error, setError] = useState('');

    const fetchCharacterDetails = async (characterId) => {
        setFetch(true);
        setError(null);

        const timeoutDuration = 5000;
        const timeoutId = setTimeout(() => {
            setFetch(false);
        }, timeoutDuration);

        try {
            if (characterId) {
                const response = await axios.get(`https://gateway.marvel.com/v1/public/characters/${characterId}?ts=1&apikey=${publicKey}&hash=${hash}`);
                const characterData = response.data.data.results[0];
                setCharacter(characterData);
                console.log(characterData);
                }
            } catch (error) {
                console.error('Error fetching character:', error);
                setError(error.toString());
            } finally {
                clearTimeout(timeoutId);
                setFetch(false);
            }
    };

    useEffect(() => {
        if (characterId) {
            fetchCharacterDetails(characterId);
        }
    }, [characterId]);

    if (!characterId) {
        return <p className='select'>Please select a character to see the details.</p>;
    }

    const characterThumbnail = character.thumbnail ? `${character.thumbnail.path}.${character.thumbnail.extension}`.replace('http', 'https') : '';

    if (isFetching) return <p className='fetch'>Fetching character details ...</p>;
    if (error) return <p className='error'>Error fetching character details: {error}</p>;

    return (
        <div className='characterDetails'>
            {character.name && <h2 className='characterTitle'>{character.name}</h2>}
            <div className='detailGrid'>
                {characterThumbnail && (<img className='characterThumbnail' src={characterThumbnail} alt={character.name} />)}
                <h3 className='descriptionTitle'>
                    Description:
                </h3>
                <div className='description'>
                    <p>
                        {character.description || 'No description available.'}
                    </p>
                </div>
                <h3 className='comicsTitle'>
                    Comics:
                </h3>
                <div className='comicsContainer'>
                    <ul className='comicsItems'>
                        {character.comics?.items.length > 0 ? (
                            character.comics.items.map(comic => (
                                <li className='comicsItem' key={comic.resourceURI}>{comic.name}</li>
                            ))
                        ) : (
                            <li>No comics available.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
};

CharacterDetail.propTypes = {
    characterId: PropTypes.number.isRequired,
};

export default CharacterDetail;
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PokemonComponent } from '../components/pokemon-component';

type PokemonImage = {
    image: string;
}

export default function Pokemon() {
    const [error, setError] = useState<string>('');
    const [image, setImage] = useState<PokemonImage | any>();

    const { pokemonName, pokemonUrl } = useLocalSearchParams();

    const fetchPokemonData = async () => {
        try {
            const request = await fetch(pokemonUrl.toString(), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const response = await request.json();
            setImage(response.sprites.other['official-artwork'].front_default);
        } catch (error) {
            setError('Error fetching Pokemon data!');
        } finally {
            console.log('Fetch Pokemon data completed!');
        }
    }

    useEffect(() => {
        fetchPokemonData();
    }, []);

    return <PokemonComponent pokemonName={pokemonName.toString().charAt(0).toUpperCase() + pokemonName.slice(1)} pokemonImage={image} pokemonErrorMessage={error} />
}

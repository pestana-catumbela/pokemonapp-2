import React, { useState } from 'react';
import { useTheme } from '../context/theme-context';
import { PokemonComponentList } from '../components/pokemon-component-list';
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

type Pokemon = {
  name: string;
  url: string;
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

export default function Pokemons() {
  const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

  const [error, setError] = useState<string>('');
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | null>(BASE_URL);

  const { themeColor } = useTheme();

  const fetchPokemonData = async () => {
    if (!nextUrl || loadingMore)
      return;
    setLoadingMore(true);

    try {
      const request = await fetch(nextUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const response:ApiResponse = await request.json();
      setPokemon(preventPokemon => [...preventPokemon, ...response.results]);
      setNextUrl(response.next);
    } catch (error) {
      setError('Error fetching Pokemon data!');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPokemon([]);
    setNextUrl(BASE_URL);
    await fetchPokemonData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColor.backgroundColor }}>
      {pokemon ? (
        <FlatList 
          data={pokemon} 
          // keyExtractor={(item) => item.url} 
          renderItem={({ item }) => <PokemonComponentList pokemonName={item.name} pokemonUrl={item.url} />}
          onEndReached={fetchPokemonData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.containerList}
        />
      ) : (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  errorText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'brown'
  },

  containerList: {
    gap: 13,
    paddingVertical: 20
  }
});

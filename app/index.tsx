import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/theme-context.tsx';
import { PokemonComponentList } from '../components/pokemon-component-list.tsx';
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

type Pokemon = {
    name: string;
    url: string;
}

type ApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

export default function Home() {
    const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [nextUrl, setNextUrl] = useState<string | null>(BASE_URL);
    const [toggleIcon, setToggleIcon] = useState<'moon' | 'sun'>('moon');
    const { setTheme, themeColor } = useTheme();

    const handleToggleIcon = () => {
        setToggleIcon(prevIcon => prevIcon === 'moon' ? 'sun' : 'moon');
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }

    const LoadMore = async () => {
        if (!nextUrl || loadingMore) return;
        setLoadingMore(true);

        try {
            const request = await fetch(nextUrl);
            const response:ApiResponse = await request.json();
            setPokemon(prevPokemon => [...prevPokemon, ...response.results]);
            setNextUrl(response.next);
        } catch (error) {
            setError('Failed to load more Pokemons.');
        } finally {
            setLoadingMore(false);
        }
    }

    const OnRefresh = async () => {
        setRefreshing(true);
        setPokemon([]);
        setNextUrl(BASE_URL);
        await LoadMore();
        setRefreshing(false);
    }

    // if (loading) return <ActivityIndicator style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />

    return (
        <View style={{ flex: 1, backgroundColor: themeColor.backgroundColor }}>
            <Stack.Screen options={{ title: 'Pokemons', headerTintColor: themeColor.headerColor, headerStyle: { backgroundColor: themeColor.headerBackgroundColor }, headerRight: ({tintColor}) => <Feather name={toggleIcon} size={24} color={tintColor} onPress={() => handleToggleIcon()} /> }} />

            {pokemon && (
                <FlatList
                    data={pokemon}
                    keyExtractor={(item) => item.url}
                    renderItem={({ item }) => <PokemonComponentList pokemonName={item.name} pokemonUrl={item.url} />}
                    onEndReached={LoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
                    refreshing={refreshing}
                    onRefresh={OnRefresh}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.containerList}
                />
            )}
            <Text style={styles.containerTextError}>{error}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    containerList: {
        gap: 13,
        paddingVertical: 20
    },

    containerTextError: {
        flex: 1,
        fontSize: 14,
        color: 'brown',
        textAlign: 'center',
        justifyContent: 'center'
    }
});
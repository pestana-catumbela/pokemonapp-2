import { useState } from 'react';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ThemeContext } from '../context/theme-context';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const [toggleIcon, setToggleIcon] = useState<string | undefined>('sun');

    const toggleTheme = () => {
        setToggleIcon(icon => icon === 'sun' ? 'moon' : 'sun');
        setTheme(theme => theme === 'light' ? 'dark' : 'light');
    }

    const themeColor = Colors[theme];

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeColor }}>
            <Stack screenOptions={{ 
                headerTintColor: themeColor.color,
                headerStyle: { backgroundColor: themeColor.backgroundColor },
                headerRight: ({tintColor}) => <Feather name={toggleIcon as any} size={24} color={tintColor} onPress={() => toggleTheme()} /> 
            }}>
                <Stack.Screen name="pokemons" options={{ title: 'Pokemons' }} />
                <Stack.Screen name="pokemon" options={{ title: 'Pokemon', headerRight: () => null }} />
            </Stack>

            <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
        </ThemeContext.Provider>
    );
}

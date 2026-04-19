import { useTheme } from '../context/theme-context';
import { Text, View, Image, StyleSheet } from 'react-native';

type PokemonComponentProps = {
    pokemonName: string;
    pokemonImage: string;
    pokemonErrorMessage?: string;
};

export const PokemonComponent = ({ pokemonName, pokemonImage, pokemonErrorMessage, ...rest }: PokemonComponentProps) => {
    const { themeColor } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: themeColor.backgroundColor }]} {...rest}>
            {pokemonErrorMessage ? <Text style={styles.error}>{pokemonErrorMessage}</Text> : (
                <>
                    <Image source={{ uri: pokemonImage }} resizeMode="cover" style={{ width: 200, height: 200 }} />
                    <Text style={[styles.name, { color: themeColor.color }]}>{pokemonName}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'
    },

    name: {
        fontSize: 18,
        fontWeight: 500
    },

    error: {
        fontSize: 15,
        fontWeight: 500,
        color: 'brown'
    }
});

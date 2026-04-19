import { Link } from 'expo-router';
import { useTheme } from '../context/theme-context';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

type PokemonComponentListProps = {
    pokemonName: string;
    pokemonUrl: string;
}

export const PokemonComponentList = ({ pokemonName, pokemonUrl, ...rest }: PokemonComponentListProps) => {
  const { themeColor } = useTheme();

  return (
    <Link href={{ pathname: '/pokemon', params: { pokemonName, pokemonUrl } }} {...rest} asChild>
      <TouchableOpacity style={styles.container}>
        <Text style={{ fontSize: 15, fontWeight: 500, color: themeColor.color }}>{pokemonName}</Text>
        <Text style={{ fontSize: 15, color: themeColor.color }}>{pokemonUrl}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '90%',
    borderRadius: 6,
    borderWidth: 0.2,
    alignSelf: 'center',
    borderColor: '#808080'
  }
});
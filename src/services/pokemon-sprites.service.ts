import { getPokemonIdFromUrl } from '@/helpers';
import { Pokemon } from '@/models';

export namespace PokemonSpritesService {
  type Sprites = Pokemon.Sprites;

  /** Simple function that takes the ID out of the pokemon URL to quickly provide pokemon sprites */
  export const getSprites = (pokemonURL: string): Sprites => {
    const pokemonId = getPokemonIdFromUrl(pokemonURL);

    const sprites: Sprites = {
      back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
    };

    return sprites;
  };
}

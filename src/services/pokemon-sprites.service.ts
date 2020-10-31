import { Pokemon } from '@/models/pokemon.model';

export namespace PokemonSpritesService {
  type Sprites = Pokemon.Sprites;

  /** Simple function that takes the ID out of the pokemon URL to quickly provide pokemon sprites */
  export const getSprites = (pokemonURL: string): Sprites => {
    const pokemonURLsplitted = pokemonURL.split('/');
    const pokemonIndex =
      pokemonURLsplitted[
        pokemonURLsplitted.length - (pokemonURL.endsWith('/') ? 2 : 1)
      ];

    const sprites: Sprites = {
      back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonIndex}.png`,
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`,
    };

    return sprites;
  };
}

import { Pokemon } from '@/models/pokemon.model';

type Sprites = Pokemon.Sprites;

const getSprites = (pokemonURL: string): Sprites => {
  const pokemonURLsplitted = pokemonURL.split('/');
  const pokemonIndex = pokemonURLsplitted[pokemonURLsplitted.length - 1];

  const sprites: Sprites = {
    back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonIndex}.png`,
    front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`,
  };

  return sprites;
};

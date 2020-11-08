import { PokemonsReferencePage } from '@/models';

type PokemonModel = PokemonsReferencePage.PokemonReferenceModel;

export const filterPokemonsByNameFactory = (searchText: string) => {
  return (pokemon: PokemonModel) => {
    return pokemon.name
      .toLowerCase()
      .startsWith(searchText.toLowerCase().replace(' ', '-'));
  };
};

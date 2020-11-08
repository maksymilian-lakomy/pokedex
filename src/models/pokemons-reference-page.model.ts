import { Pokemon } from './pokemon.model';

export namespace PokemonsReferencePage {
  export interface PokemonReferenceModel {
    name: string;
    url: string;
  }

  export interface PokemonsReferencePageModel {
    count: number;
    next: string;
    previous?: any;
    results: PokemonReferenceModel[];
  }

  export interface PokemonExtendedReferenceModel extends PokemonReferenceModel {
    sprites: Pokemon.Sprites;
    id: string;
  }
}

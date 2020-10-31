export declare module PokemonsReferencePage {
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
}

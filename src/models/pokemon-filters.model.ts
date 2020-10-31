export namespace PokemonFilters {
  export interface Language {
    name: string;
    url: string;
  }

  export interface AwesomeName {
    awesome_name: string;
    language: Language;
  }

  export interface Language2 {
    name: string;
    url: string;
  }

  export interface Name {
    language: Language2;
    name: string;
  }

  export interface PokemonSpecy {
    name: string;
    url: string;
  }

  export interface PokemonFiltersModel {
    awesome_names: AwesomeName[];
    id: number;
    name: string;
    names: Name[];
    pokemon_species: PokemonSpecy[];
  }
}

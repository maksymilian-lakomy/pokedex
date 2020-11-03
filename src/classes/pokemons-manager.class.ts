import { PokemonsReferencePage } from '@/models';

import { PokemonsPageDefault } from './pokemons-page/pokemons-page-default.class';
import { PokemonsPageFiltered } from './pokemons-page/pokemons-page-filtered.class';
import { PokemonsPage } from './pokemons-page/pokemons-page.class';

type ExtendedPokemon = PokemonsReferencePage.PokemonExtendedReferenceModel;
type Filters = Map<string, string[]>;

export class PokemonsManager {
  private filters: Filters = new Map();
  private pokemonsPage: PokemonsPage;

  constructor(private limit = 50) {
    this.pokemonsPage = new PokemonsPageDefault();
  }

  public addFilter(name: string, value: string) {
    if (this.filters.has(name)) {
      this.filters.get(name)!.push(value);
    } else {
      this.filters.set(name, [value]);
    }

    this.updatePokemonsType();
  }

  public setFilters(filters: Filters) {
    this.filters = filters;

    this.updatePokemonsType();
  }

  public removeFilter(name: string, value: string) {
    if (!this.filters.has(name)) {
      return;
    }

    this.filters.set(
      name,
      this.filters.get(name)!.filter((filter) => filter !== value)
    );

    if (this.filters.get(name)!.length === 0) {
      this.filters.delete(name);
    }

    this.updatePokemonsType();
  }

  public async getPokemons(page: number): Promise<ExtendedPokemon[]> {
    const pokemons = await this.pokemonsPage.getPokemons(
      this.offset(page),
      this.limit
    );
    return pokemons;
  }

  public get pagesAmount(): number {
    return Math.ceil(this.pokemonsPage.pokemonsAmount / this.limit);
  }

  private updatePokemonsType(): void {
    if (this.filters.size === 0) {
      this.pokemonsPage = new PokemonsPageDefault();
    } else {
      this.pokemonsPage = new PokemonsPageFiltered(this.filters);
    }
  }

  private offset(page: number): number {
    return (page - 1) * this.limit;
  }
}

import { PokemonsReferencePage } from '@/models';

import { PokemonsPageDefault } from './pokemons-page/pokemons-page-default.class';
import { PokemonsPageFiltered } from './pokemons-page/pokemons-page-filtered.class';
import { PokemonsPageSearched } from './pokemons-page/pokemons-page-searched.class';
import { PokemonsPage } from './pokemons-page/pokemons-page.class';

type ExtendedPokemon = PokemonsReferencePage.PokemonExtendedReferenceModel;
type Filters = Map<string, string[]>;

export class PokemonsManager {
  private filters: Filters = new Map();
  private pokemonsPage: PokemonsPage;
  private searchText: string = '';

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

  public setFilters(filters: Filters, searchText?: string) {
    this.filters = filters;
    this.searchText = searchText || '';

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

  public get pokemonsAmount(): number {
    return this.pokemonsPage.pokemonsAmount;
  }

  private updatePokemonsType(): void {
    if (this.filters.size === 0) {
      this.pokemonsPage = this.searchText
        ? new PokemonsPageSearched(this.searchText)
        : new PokemonsPageDefault();
    } else {
      this.pokemonsPage = new PokemonsPageFiltered(
        this.filters,
        this.searchText
      );
    }
  }

  private offset(page: number): number {
    return (page - 1) * this.limit;
  }
}

import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import { PokemonsFilterService } from '@/services';
import { PokemonsPageDefault } from './pokemons-page/pokemons-page-default.class';
import { PokemonsPageFiltered } from './pokemons-page/pokemons-page-filtered.class';
import { PokemonsPage } from './pokemons-page/pokemons-page.class';

type FilterType = PokemonsFilterService.FilterType;

type Filters = Map<FilterType, (string | number)[]>;

export class PokemonsManager {
  private filters: Filters = new Map();
  private pokemonsPage: PokemonsPage;

  constructor(private limit = 50) {
    this.pokemonsPage = new PokemonsPageDefault();
  }

  public addFilter(name: FilterType, value: string | number) {
    if (this.filters.has(name)) {
      this.filters.get(name)!.push(value);
    } else {
      this.filters.set(name, [value]);
    }

    this.updatePokemonsType();
  }

  public removeFilter(name: FilterType, value: string | number) {
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

  public async getPokemons(page: number): Promise<PokemonsWithSprites[]> {
    const pokemons = await this.pokemonsPage.getPokemons(
      this.offset(page),
      this.limit
    );
    return pokemons;
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

import { AxiosResponse } from 'axios';

import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import { PokemonSpritesService } from './pokemon-sprites.service';
import { PokemonsSpeciesService } from './pokemons-species.service';
import { PokemonsFilterService } from '@/services';
import { Pokemon, PokemonFilters, PokemonsReferencePage } from '@/models';

type FilterType = PokemonsFilterService.FilterType;

export class PokemonsService {
  private filters = new Map<FilterType, (string | number)[]>();

  private pokemons: Pokemons;

  constructor(private limit = 50) {
    this.pokemons = new AllPokemons();
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
    const pokemons = await this.pokemons.getPokemons(
      this.offset(page),
      this.limit
    );
    return pokemons;
  }

  private updatePokemonsType(): void {
    if (this.filters.size === 0) {
      this.pokemons = new AllPokemons();
    } else {
      this.pokemons = new FilteredPokemons(this.filters);
    }
  }

  private offset(page: number): number {
    return (page - 1) * this.limit;
  }
}

abstract class Pokemons {
  public abstract async getPokemons(
    offset: number,
    limit: number
  ): Promise<PokemonsWithSprites[]>;
}

class AllPokemons extends Pokemons {
  public async getPokemons(
    offset: number,
    limit: number
  ): Promise<PokemonsWithSprites[]> {
    const response = await PokemonsSpeciesService.getAll({ offset, limit });

    return response.data.results.map((pokemon) => {
      return {
        ...pokemon,
        sprites: PokemonSpritesService.getSprites(pokemon.url),
      };
    });
  }
}

class FilteredPokemons extends Pokemons {
  constructor(private filters: Map<FilterType, (string | number)[]>) {
    super();
  }

  public async getPokemons(
    offset: number,
    limit: number
  ): Promise<PokemonsWithSprites[]> {
    const filteredPokemons = (await this.getPokemonFromAPI()).map((pokemon) => {
      return {
        ...pokemon,
        sprites: PokemonSpritesService.getSprites(pokemon.url),
      };
    });

    return filteredPokemons;
  }

  private async getPokemonFromAPI(): Promise<PokemonFilters.PokemonSpecy[]> {
    const promises = new Map<
      FilterType,
      Promise<AxiosResponse<PokemonFilters.PokemonFiltersModel>>[]
    >();

    this.filters.forEach((filters, filtersName) => {
      filters.forEach((filter) => {
        if (promises.has(filtersName)) {
          promises
            .get(filtersName)!
            .push(PokemonsFilterService.getAll(filtersName, filter));
        }
      });
    });

    let list: PokemonFilters.PokemonSpecy[] = [];

    promises.forEach(async (_promises) => {
      const responses = await Promise.all(_promises);

      if (!list.length) {
        list = this.getUniquePokemonsFromResponses(responses);
      } else {
        list = this.intersectPokemons(
          list,
          this.getUniquePokemonsFromResponses(responses)
        );
      }
    });

    return list;
  }

  private getUniquePokemonsFromResponses(
    responses: AxiosResponse<PokemonFilters.PokemonFiltersModel>[]
  ): PokemonFilters.PokemonSpecy[] {
    const uniquePokemons: Record<string, PokemonFilters.PokemonSpecy> = {};

    responses.forEach((response) => {
      response.data.pokemon_species.forEach((pokemonSpecies) => {
        uniquePokemons[pokemonSpecies.name] = pokemonSpecies;
      });
    });

    return Object.values(uniquePokemons);
  }

  private intersectPokemons(
    list: PokemonFilters.PokemonSpecy[],
    secondList: PokemonFilters.PokemonSpecy[]
  ): PokemonFilters.PokemonSpecy[] {
    return list.filter((pokemon) => secondList.includes(pokemon));
  }
}

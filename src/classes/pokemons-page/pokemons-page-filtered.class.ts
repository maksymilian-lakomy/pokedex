import { AxiosResponse } from 'axios';

import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import { PokemonFilters } from '@/models';
import { PokemonSpritesService, PokemonsFilterService } from '@/services';

import { PokemonsPage } from './pokemons-page.class';

type Filters = Map<string, string[]>;

export class PokemonsPageFiltered extends PokemonsPage {
  private pokemons: PokemonsWithSprites[] | null = null;

  constructor(private filters: Filters) {
    super();
  }

  public async getPokemons(
    offset: number,
    limit: number
  ): Promise<PokemonsWithSprites[]> {
    !this.pokemons && (await this.fetchPokemons());

    return this.pokemons!.slice(offset, offset + limit);
  }

  private async fetchPokemons(): Promise<void> {
    const pokemons = await this.getPokemonFromAPI();
    this.pokemons = pokemons.map((pokemon) => {
      return {
        ...pokemon,
        sprites: PokemonSpritesService.getSprites(pokemon.url),
      };
    });
  }

  private async getPokemonFromAPI(): Promise<PokemonFilters.PokemonSpecy[]> {
    const promises: Partial<Record<
      string,
      Promise<AxiosResponse<PokemonFilters.PokemonFiltersModel>>[]
    >> = {};

    this.filters.forEach((filters, filterType) => {
      filters.forEach((filter) => {
        const response = PokemonsFilterService.getAll(filterType, filter);

        promises[filterType]
          ? promises[filterType]!.push(response)
          : (promises[filterType] = [response]);
      });
    });

    let list: PokemonFilters.PokemonSpecy[] = [];

    await Promise.all(
      Object.values(promises).map(async (_promises) => {
        const responses = await Promise.all(_promises!);

        if (!list.length) {
          list = this.getUniquePokemonsFromResponses(responses);
        } else {
          list = this.intersectPokemons(
            list,
            this.getUniquePokemonsFromResponses(responses)
          );
        }
      })
    );

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
    return list.filter(
      (pokemon) =>
        secondList.findIndex(
          (secondPokemon) => secondPokemon.name === pokemon.name
        ) !== -1
    );
  }
}

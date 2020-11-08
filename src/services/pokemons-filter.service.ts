import { PokemonFilters } from '@/models';
import { AxiosResponse } from 'axios';
import { service } from './base.service';

type PokemonFiltersModel = PokemonFilters.PokemonFiltersModel;

export namespace PokemonsFilterService {
  export const getAll = async (
    filterType: string,
    filter: string
  ): Promise<AxiosResponse<PokemonFiltersModel>> => {
    const response: AxiosResponse<PokemonFiltersModel> = await service.get(
      `pokemon-${filterType}/${filter}`
    );

    return response;
  };
}

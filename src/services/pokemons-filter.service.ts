import { PokemonFilters } from '@/models';
import { AxiosResponse } from 'axios';
import { service } from './base.service';

type PokemonFiltersModel = PokemonFilters.PokemonFiltersModel;

export namespace PokemonsFilterService {
  export enum FilterType {
    COLORS = 'pokemon-color',
    HABITATS = 'pokemon-habitat',
    SHAPES = 'pokemon-shape',
  }

  export const getAll = async (
    filter: FilterType
  ): Promise<AxiosResponse<PokemonFiltersModel>> => {
    const response: AxiosResponse<PokemonFiltersModel> = await service.get(
      `${filter}/`
    );

    return response;
  };
}

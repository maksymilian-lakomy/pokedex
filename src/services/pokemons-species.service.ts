import { service } from './base.service';
import { PokemonsReferencePage, PokemonSpecies } from '../models';
import { AxiosResponse } from 'axios';

type PokemonsReferencePageModel = PokemonsReferencePage.PokemonsReferencePageModel;
type PokemonSpeciesModel = PokemonSpecies.PokemonSpeciesModel;

export namespace PokemonsSpeciesService {
  export interface GetAllParams {
    limit?: number;
    offset?: number;
  }

  export const getAll = async (
    params?: GetAllParams
  ): Promise<AxiosResponse<PokemonsReferencePageModel>> => {
    const response: AxiosResponse<PokemonsReferencePageModel> = await service.get(
      'pokemon-species/',
      {
        params,
      }
    );

    return response;
  };

  export const get = async (
    name: string | number
  ): Promise<AxiosResponse<PokemonSpeciesModel>> => {
    const response: AxiosResponse<PokemonSpeciesModel> = await service.get(
      `pokemon-species/${name}`
    );

    return response;
  };
}

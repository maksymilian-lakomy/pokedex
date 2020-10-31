import { service } from './base.service';
import { PokemonsReferencePage, PokemonSpecies } from '../models';
import { AxiosResponse } from 'axios';

export interface getAllParams {
  limit: number;
  offset: number;
}

type PokemonsReferencePageModel = PokemonsReferencePage.PokemonsReferencePageModel;

export const getAll = async (
  params: getAllParams
): Promise<AxiosResponse<PokemonsReferencePageModel>> => {
  const response: AxiosResponse<PokemonsReferencePageModel> = await service.get(
    'pokemon-species/',
    {
      params,
    }
  );

  return response;
};

type PokemonSpeciesModel = PokemonSpecies.PokemonSpeciesModel;

export const get = async (
  name: string | number
): Promise<AxiosResponse<PokemonSpeciesModel>> => {
  const response: AxiosResponse<PokemonSpeciesModel> = await service.get(
    `pokemon-species/${name}`
  );

  return response;
};

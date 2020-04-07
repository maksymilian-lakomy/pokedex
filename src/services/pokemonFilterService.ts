import Service from './Service';
import { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon';

import { Filters } from "@/enums/Filters";
import PokemonSimpleData from '@/classes/PokemonSimpleData';

interface GetAllParams {
    filter: Filters;
    name: string;
}

interface GetFilterOptions {
    filter: Filters;
}

interface FilterSpeciesResponse {
    pokemon_species: Array<PokemonSimpleData>;
}

interface FilterResponse {
    count: number;
    results: Array<PokemonSimpleData>;
}

export default {
    async getAll(params: GetAllParams, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${params.filter}/${params.name}`);
        if (response.status === 200) {
            const result = response.data as FilterSpeciesResponse;
            const pokemonSpecies = new Map<string, string>();
            result.pokemon_species.forEach(pokemon => {
                pokemonSpecies.set(pokemon.name, pokemon.url);
            });
            callback(pokemonSpecies)
        } else
            errorCallback(response);
    },

    async getFiltersOptions(params: GetFilterOptions, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${params.filter}`);
        if (response.status === 200) {
            let result = response.data as FilterResponse;
            if (result.results.length < result.count)
                await Service.get(`${pokemonEndPoint}-${params.filter}?limit=${result.count}`).then((finalResponse: AxiosResponse) => {
                    result = response.data as FilterResponse;
                });
            const filterMap = new Map<string, boolean>();
            result.results.forEach(filter => {
                filterMap.set(filter.name, false);
            });
            callback(filterMap);
        } else
            errorCallback(response);
    }
}

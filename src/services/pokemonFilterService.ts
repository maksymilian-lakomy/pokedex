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
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${params.filter}?limit=1`);
        if (response.status === 200) {
            let result = response.data as FilterResponse;
            const finalResponse = await Service.get(`${pokemonEndPoint}-${params.filter}?limit=${result.count}`);
            if (finalResponse.status === 200) {
                result = finalResponse.data as FilterResponse;
                const filterOptions: string[] = [];
                result.results.forEach(option => {
                    filterOptions.push(option.name);
                });
                callback(filterOptions);
            } else
                errorCallback(finalResponse);
        } else
            errorCallback(response);
    }
}

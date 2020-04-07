import Service from './Service';
import { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon';

import { Filter } from "@/enums/Filters";
import PokemonSimpleData from '@/classes/PokemonSimpleData';

interface GetFilteredPokemonSpecies {
    filter: Filter;
    option: string;
}

interface GetAllFilteredPokemonSpecies {
    filter: Filter;
    options: Array<string>;
}

interface GetFiltersIntersection {
    filters: {
        filter: Filter;
        options: Array<string>;
    }[];
}

interface GetFilterOptions {
    filter: Filter;
}

interface FilterSpeciesResponse {
    pokemon_species: Array<PokemonSimpleData>;
}

interface FilterResponse {
    count: number;
    results: Array<PokemonSimpleData>;
}

export default {
    async getFilteredPokemonSpecies(params: GetFilteredPokemonSpecies): Promise<Map<string, string>> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${params.filter.api}/${params.option}`);
        if (response.status !== 200) 
            throw response;

        const result = response.data as FilterSpeciesResponse;
        const pokemonSpecies = new Map<string, string>();
        result.pokemon_species.forEach(pokemon => {
            pokemonSpecies.set(pokemon.name, pokemon.url);
        });
        return pokemonSpecies;
    },

    async getAllFilteredPokemonSpecies({filter, options}: GetAllFilteredPokemonSpecies): Promise<Map<string, string>> {
        let result = new Map<string, string>();
        for await (const option of options) {
            const pokemonSpieces = await this.getFilteredPokemonSpecies({filter, option});
            result = new Map([...result, ...pokemonSpieces]);
        }
        return result;
    },

    async getFiltersIntersection({filters}: GetFiltersIntersection): Promise<Map<string, string>> {
        let result = new Map<string, string>();
        for await (const filter of filters) {
            const allPokemonSpieces = await this.getAllFilteredPokemonSpecies(filter);
            if (result.size === 0)
                result = allPokemonSpieces;
            else
                result = new Map([...result].filter(pokemonSpecies => allPokemonSpieces.has(pokemonSpecies[0])));
        }
        return result;
    },

    async getOptions(params: GetFilterOptions): Promise<Array<string>> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${params.filter.api}?limit=1`);
        if (response.status !== 200)
            throw response;

        let result = response.data as FilterResponse;
        const finalResponse = await Service.get(`${pokemonEndPoint}-${params.filter.api}?limit=${result.count}`);
        if (finalResponse.status !== 200)
            throw response;

        result = finalResponse.data as FilterResponse;
        const options: string[] = [];
        result.results.forEach(option => options.push(option.name));
        return options;
    }
}

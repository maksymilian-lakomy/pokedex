import Service from './Service';
import { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon';

import { filters } from "@/enums/Filters";
import PokemonSimpleData from '@/classes/PokemonSimpleData';
import { Route } from 'vue-router';

interface GetFilteredPokemonSpecies {
    filter: string;
    option: string;
}

interface GetAllFilteredPokemonSpecies {
    filter: string;
    options: Array<string>;
}

interface GetFiltersIntersection {
    filters: Record<string, Array<string>>;
}

interface GetFilterOptions {
    filter: string;
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
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${params.filter}/${params.option}`);
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
        for (const filter in filters) {
            console.log(filter, filters[filter]);
            const allPokemonSpieces = await this.getAllFilteredPokemonSpecies({filter, options: filters[filter]});
            if (result.size === 0) {
                result = allPokemonSpieces;
                console.log('first:', result);
            }
            else {
                result = new Map([...result].filter(pokemonSpecies => allPokemonSpieces.has(pokemonSpecies[0])));
                console.log(result);
            }
        }
        console.log('after Intersection');
        return result;
    },

    async getOptions({filter}: GetFilterOptions): Promise<Array<string>> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${filter}?limit=1`);
        if (response.status !== 200)
            throw response;

        let result = response.data as FilterResponse;
        const finalResponse = await Service.get(`${pokemonEndPoint}-${filter}?limit=${result.count}`);
        if (finalResponse.status !== 200)
            throw response;

        result = finalResponse.data as FilterResponse;
        const options: string[] = [];
        result.results.forEach(option => options.push(option.name));
        return options;
    },
}

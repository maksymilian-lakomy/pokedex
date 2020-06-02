import Service from './Service';
import { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon';

import PokemonSimpleData from '@/classes/PokemonSimpleData';

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
    async getFilteredPokemonSpecies({ filter, option }: GetFilteredPokemonSpecies): Promise<Record<string, string>> {
        const response = await Service.get(`${pokemonEndPoint}-${filter}/${option}`);

        const pokemonSpeciesResult = (response.data as FilterSpeciesResponse).pokemon_species;
        const pokemonSpecies: Record<string, string> = {};

        pokemonSpeciesResult.forEach(pokemon => pokemonSpecies[pokemon.name] = pokemon.url);
        return pokemonSpecies;
    },

    async getAllFilteredPokemonSpecies({ filter, options }: GetAllFilteredPokemonSpecies): Promise<Record<string, string>> {
        let pokemonSpecies: Record<string, string> = {};
        const pokemonSpeciesArray = await Promise.all(options.map(option => this.getFilteredPokemonSpecies({filter, option})));
        pokemonSpeciesArray.forEach(array => pokemonSpecies = {...pokemonSpecies, ...array});
        console.log(pokemonSpecies);
        return pokemonSpecies;
    },

    async getOptions({ filter }: GetFilterOptions): Promise<Array<string>> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}-${filter}?limit=1`);
        const count = (response.data as FilterResponse).count;

        const finalResponse = await Service.get(`${pokemonEndPoint}-${filter}?limit=${count}`);
        const results = (finalResponse.data as FilterResponse).results;

        const options = results.map(option => option.name);
        return options;
    },
}

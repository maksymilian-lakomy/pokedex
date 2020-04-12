import Service from './Service';
import Axios, { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon-species';

import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import pokemonService from './pokemonService';
import pageMapper from './methods/pageMapper';
import querify from './methods/querify';
import PokemonData from '@/classes/PokemonData';
import PageResponse from './PageResponse';
import PokemonSimpleData from '@/classes/PokemonSimpleData';

interface GetParams {
    pokemon: number | string;
    full?: boolean;
}

interface GetByUrlParams {
    url: string;
    full?: boolean;
}

async function getFullSpecies(pokemonSpeciesData: PokemonSpeciesData, full?: boolean) {
    for await (const variety of pokemonSpeciesData.varieties) {
        variety.pokemonFull = await pokemonService.getByUrl(variety.pokemon.url)
        if (full)
            return pokemonSpeciesData;
    }
    return pokemonSpeciesData;
}

export default {
    async getMap(): Promise<Map<string, string>> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}?limit=1`);
        if (response.status !== 200) 
            throw response;

        let result = response.data as PageResponse<PokemonSimpleData>;
        const finalResponse = await Service.get(`${pokemonEndPoint}?limit=${result.count}`);
        if (finalResponse.status !== 200) 
            throw finalResponse;

        result = finalResponse.data as PageResponse<PokemonSimpleData>;
        const pokemonSpeciesMap = new Map<string, string>();
        result.results.forEach(pokemon => {
            pokemonSpeciesMap.set(pokemon.name, pokemon.url);
        });
        return pokemonSpeciesMap;
    },

    async get({pokemon, full = false}: GetParams): Promise<PokemonSpeciesData> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/${pokemon}`);
        if (response.status !== 200)
            throw response;

        return await getFullSpecies(new PokemonSpeciesData(response.data), full);
    },

    async getByUrl({url, full = false}: GetByUrlParams): Promise<PokemonSpeciesData> {
        const response: AxiosResponse = await Axios.get(url);
        if (response.status !== 200)
            throw response;

        return await getFullSpecies(new PokemonSpeciesData(response.data), full);
    }
}

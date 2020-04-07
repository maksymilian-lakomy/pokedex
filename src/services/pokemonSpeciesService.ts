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
}

async function getFullSpecies(pokemonSpeciesData: PokemonSpeciesData) {
    await Promise.all(
        pokemonSpeciesData.varieties.map(async variety => {
            await pokemonService.getByUrl(variety.pokemon.url, (pokemonData: PokemonData) => {
                variety.pokemonFull = pokemonData;
            }, (error: AxiosResponse) => {
                console.error(error);
            });
        }));
    return pokemonSpeciesData;
}

export default {
    async getAll(callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}?limit=1`);
        if (response.status === 200) {
            let result = response.data as PageResponse<PokemonSimpleData>;
            const finalResponse = await Service.get(`${pokemonEndPoint}?limit=${result.count}`);
            if (finalResponse.status === 200) {
                result = finalResponse.data as PageResponse<PokemonSimpleData>;
                const pokemonMap = new Map<string, string>();
                result.results.forEach(pokemon => {
                    pokemonMap.set(pokemon.name, pokemon.url);
                });
                callback(pokemonMap);
            } else
                errorCallback(response);
        } else
            errorCallback(response);
},

async get(params: GetParams, callback: Function, errorCallback: Function) {
    const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/${params.pokemon}`);
    response.status === 200 ? callback(await getFullSpecies(new PokemonSpeciesData(response.data))) : errorCallback(response);
},

async getByUrl(url: string, callback: Function, errorCallback: Function) {
    const response: AxiosResponse = await Axios.get(url);
    response.status === 200 ? callback(await getFullSpecies(new PokemonSpeciesData(response.data))) : errorCallback(response);
}
}

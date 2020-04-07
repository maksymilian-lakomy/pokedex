import Service from './Service';
import Axios, { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon-species';

import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import pokemonService from './pokemonService';
import pageMapper from './methods/pageMapper';
import querify from './methods/querify';
import PokemonData from '@/classes/PokemonData';

interface GetAllParams {
    offset?: number;
    limit?: number;
}

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
    async getAll(params: GetAllParams, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/?${querify(params)}`);
        response.status === 200 ? callback(pageMapper(response.data)) : errorCallback(response);
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

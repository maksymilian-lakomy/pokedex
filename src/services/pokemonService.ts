import Service from './Service';
import Axios, { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon';

import PokemonData from '@/classes/PokemonData';
import pokemonsMapper from './methods/pokemonsMapper';
import querify from './methods/querify';

interface GetAllParams {
    offset?: number;
    limit?: number;
}

interface GetParams {
    pokemon: number | string;
}

export default {
    async getAll(params: GetAllParams, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/?${querify(params)}`);
        response.status === 200 ? callback(await pokemonsMapper(response.data)) : errorCallback(response);
    },

    async GetAllByUrl(url: string, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Axios.get(url);
        response.status === 200 ? callback(await pokemonsMapper(response.data)) : errorCallback(response);
    },

    async get(params: GetParams, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/${params.pokemon}`);
        response.status === 200 ? callback(new PokemonData(response.data)) : errorCallback(response);
    },

    async getByUrl(url: string, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Axios.get(url);
        response.status === 200 ? callback(new PokemonData(response.data)) : errorCallback(response);
    }
}

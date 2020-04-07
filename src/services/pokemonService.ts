import Service from './Service';
import Axios, { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon';

import PokemonData from '@/classes/PokemonData';

interface GetParams {
    pokemon: number | string;
}

export default {
    async get(params: GetParams, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/${params.pokemon}`);
        response.status === 200 ? callback(new PokemonData(response.data)) : errorCallback(response);
    },

    async getByUrl(url: string, callback: Function, errorCallback: Function) {
        const response: AxiosResponse = await Axios.get(url);
        response.status === 200 ? callback(new PokemonData(response.data)) : errorCallback(response);
    }
}

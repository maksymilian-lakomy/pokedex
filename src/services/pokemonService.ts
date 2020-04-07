import Service from './Service';
import Axios, { AxiosResponse } from 'axios';

const pokemonEndPoint = '/pokemon';

import PokemonData from '@/classes/PokemonData';

interface GetParams {
    pokemon: number | string;
}

export default {
    async get(params: GetParams): Promise<PokemonData> {
        const response: AxiosResponse = await Service.get(`${pokemonEndPoint}/${params.pokemon}`);
        if (response.status !== 200)
            throw response;
            
        return new PokemonData(response.data);
    },

    async getByUrl(url: string): Promise<PokemonData> {
        const response: AxiosResponse = await Axios.get(url);
        if (response.status !== 200)
            throw response;

        return new PokemonData(response.data);
    }
}

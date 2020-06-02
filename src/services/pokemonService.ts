import Service from './Service';
import Axios from 'axios';

const pokemonEndPoint = '/pokemon';

import PokemonData from '@/classes/PokemonData';

interface GetParams {
    pokemon: number | string;
}

export default {
    async get(params: GetParams): Promise<PokemonData> {
        const response = await Service.get(`${pokemonEndPoint}/${params.pokemon}`);
        return new PokemonData(response.data);
    },

    async getByUrl(url: string): Promise<PokemonData> {
        const response = await Axios.get(url);
        return new PokemonData(response.data);
    }
}

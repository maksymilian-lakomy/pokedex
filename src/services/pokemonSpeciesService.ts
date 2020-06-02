import Service from './Service';
import Axios from 'axios';

const pokemonEndPoint = '/pokemon-species';

import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import pokemonService from './pokemonService';
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
    if (full === true) {
        const fullPokemons = await Promise.all(pokemonSpeciesData.varieties.map(variety => pokemonService.getByUrl(variety.pokemon.url)));
        fullPokemons.forEach((pokemon, i) => pokemonSpeciesData.varieties[i].pokemonFull = pokemon);
    } else
        pokemonSpeciesData.varieties[0].pokemonFull = await pokemonService.getByUrl(pokemonSpeciesData.varieties[0].pokemon.url);
    return pokemonSpeciesData;
}

export default {
    async getMap(): Promise<Map<string, string>> {
        const limitResponse = await Service.get(`${pokemonEndPoint}?limit=1`);
        const limit = (limitResponse.data as PageResponse<PokemonSimpleData>).count;

        const pokemonMapResponse = await Service.get(`${pokemonEndPoint}?limit=${limit}`);
        const pokemonsResults = (pokemonMapResponse.data as PageResponse<PokemonSimpleData>).results;

        const pokemonSpeciesMap = new Map<string, string>();
        pokemonsResults.forEach(pokemon => pokemonSpeciesMap.set(pokemon.name, pokemon.url));

        return pokemonSpeciesMap;

    },

    async get({ pokemon, full = false }: GetParams): Promise<PokemonSpeciesData> {
        const response = await Service.get(`${pokemonEndPoint}/${pokemon}`);
        return await getFullSpecies(new PokemonSpeciesData(response.data), full);
    },

    async getByUrl({ url, full = false }: GetByUrlParams): Promise<PokemonSpeciesData> {
        const response = await Axios.get(url);
        return await getFullSpecies(new PokemonSpeciesData(response.data), full);
    }
}

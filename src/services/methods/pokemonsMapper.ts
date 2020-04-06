import PageResponse from '../PageResponse';
import PokemonData from '@/classes/PokemonData';

import pokemonService from '../pokemonService';
import { AxiosResponse } from 'axios';

interface SimplePokemonResponse {
    name: string;
    url: string;
}

export default async function pokemonsMapper(page: PageResponse<SimplePokemonResponse>) {
    const pokemons: PageResponse<PokemonData> = {
        count: page.count,
        next: page.next,
        previous: page.previous,
        results: new Array<PokemonData>()
    }
    await Promise.all(
        page.results.map(async (simplePokemonResponse) => {
        await pokemonService.getByUrl(simplePokemonResponse.url, (pokemon: PokemonData) => {
            pokemons.results.push(pokemon);
        }, (error: AxiosResponse) => {
            console.error(error);
        });
    }));
    return pokemons;
}

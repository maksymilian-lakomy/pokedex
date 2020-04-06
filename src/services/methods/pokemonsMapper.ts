import PageResponse from '../PageResponse';
import PokemonData from '@/classes/PokemonData';

import pokemonService from '../pokemonService';
import { AxiosResponse } from 'axios';

interface SimplePokemonResponse {
    name: string;
    url: string;
}

export default function pokemonsMapper(page: PageResponse<SimplePokemonResponse>) {
    const pokemons: PageResponse<PokemonData> = {
        count: page.count,
        next: page.next,
        previous: page.previous,
        results: new Array<PokemonData>()
    }
    page.results.forEach(async simplePokemonResponse => {
        pokemonService.getByUrl(simplePokemonResponse.url, (pokemon: PokemonData) => {
            pokemons.results.push(pokemon);
        }, (error: AxiosResponse) => {
            console.error(error);
        });
    })
    return pokemons;
}

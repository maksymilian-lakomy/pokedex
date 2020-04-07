import PageResponse from '../PageResponse';
import PokemonSimpleData from '@/classes/PokemonSimpleData';

export default function pageMapper(page: PageResponse<PokemonSimpleData>) {
    const pokemons: PageResponse<PokemonSimpleData> = {
        count: page.count,
        next: page.next,
        previous: page.previous,
        results: page.results as PokemonSimpleData[]
    }
    return pokemons;
}

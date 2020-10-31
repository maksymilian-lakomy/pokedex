import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import { PokemonsSpeciesService, PokemonSpritesService } from '@/services';

import { PokemonsPage } from './pokemons-page.class';

export class PokemonsPageDefault extends PokemonsPage {
  public async getPokemons(
    offset: number,
    limit: number
  ): Promise<PokemonsWithSprites[]> {
    const response = await PokemonsSpeciesService.getAll({ offset, limit });

    return response.data.results.map((pokemon) => {
      return {
        ...pokemon,
        sprites: PokemonSpritesService.getSprites(pokemon.url),
      };
    });
  }
}

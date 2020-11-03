import { getPokemonIdFromUrl } from '@/helpers';
import { PokemonsReferencePage } from '@/models';
import { PokemonsSpeciesService, PokemonSpritesService } from '@/services';

import { PokemonsPage } from './pokemons-page.class';

type ExtendedPokemon = PokemonsReferencePage.PokemonExtendedReferenceModel;

export class PokemonsPageDefault extends PokemonsPage {
  private _pokemonsAmount: number = 0;

  public get pokemonsAmount(): number {
    return this._pokemonsAmount;
  }

  public async getPokemons(
    offset: number,
    limit: number
  ): Promise<ExtendedPokemon[]> {
    const response = await PokemonsSpeciesService.getAll({
      offset,
      limit,
    });

    this._pokemonsAmount = response.data.count;

    return response.data.results.map((pokemon) => {
      const id = getPokemonIdFromUrl(pokemon.url);
      return {
        ...pokemon,
        id,
        sprites: PokemonSpritesService.getSprites(id),
      };
    });
  }
}

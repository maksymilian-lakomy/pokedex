import { PokemonsWithSprites } from '@/components/pokemon-tile.models';

export abstract class PokemonsPage {
  public abstract async getPokemons(
    offset: number,
    limit: number
  ): Promise<PokemonsWithSprites[]>;
}

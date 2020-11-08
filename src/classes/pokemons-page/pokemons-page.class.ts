import { PokemonsReferencePage } from '@/models';

type ExtendedPokemon = PokemonsReferencePage.PokemonExtendedReferenceModel;

export abstract class PokemonsPage {
  public abstract async getPokemons(
    offset: number,
    limit: number,
  ): Promise<ExtendedPokemon[]>;

  public abstract get pokemonsAmount(): number;
  
}

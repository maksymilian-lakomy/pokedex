import { Pokemon, PokemonsReferencePage } from '@/models';

export interface PokemonsWithSprites
  extends PokemonsReferencePage.PokemonReferenceModel {
  sprites: Pokemon.Sprites;
}

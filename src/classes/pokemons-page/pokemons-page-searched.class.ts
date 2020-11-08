import { filterPokemonsByNameFactory, getPokemonIdFromUrl } from '@/helpers';
import { PokemonsReferencePage } from '@/models';
import { PokemonSpritesService, PokemonsSpeciesService } from '@/services';

import { PokemonsPage } from './pokemons-page.class';

type ExtendedPokemon = PokemonsReferencePage.PokemonExtendedReferenceModel;

export class PokemonsPageSearched extends PokemonsPage {
  private pokemons: ExtendedPokemon[] | null = null;

  public get pokemonsAmount(): number {
    return this.pokemons?.length || 0;
  }

  constructor(private searchText: string) {
    super();
  }

  public async getPokemons(
    offset: number,
    limit: number
  ): Promise<ExtendedPokemon[]> {
    !this.pokemons && (await this.fetchPokemons());

    return this.pokemons!.slice(offset, offset + limit);
  }

  private async fetchPokemons(): Promise<void> {
    const limit = (await PokemonsSpeciesService.getAll({ limit: 0, offset: 0 }))
      .data.count;

    const response = await PokemonsSpeciesService.getAll({ limit });
    const filterPokemonsByName = filterPokemonsByNameFactory(this.searchText);

    this.pokemons = response.data.results
      .map((pokemon) => {
        const id = getPokemonIdFromUrl(pokemon.url);
        return {
          ...pokemon,
          id,
          sprites: PokemonSpritesService.getSprites(id),
        };
      })
      .filter(filterPokemonsByName);
  }
}

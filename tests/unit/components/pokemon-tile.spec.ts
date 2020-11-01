import { shallowMount } from '@vue/test-utils';

import PokemonTileComponent from '@/components/pokemon-tile.component.vue';
import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import { PokemonSpritesService } from '@/services';

describe('PokemonTileComponent', () => {
  const mockPokemonId = 'idMock';
  const mockPokemonURL = `https://pokeapi.co/api/v2/pokemon/${mockPokemonId}/`;

  const mockPokemon: PokemonsWithSprites = {
    name: 'pokemonNameMock',
    url: mockPokemonURL,
    sprites: PokemonSpritesService.getSprites(mockPokemonURL),
  };

  const createComponent = () => {
    return shallowMount(PokemonTileComponent, {
      propsData: {
        pokemonWithSprites: mockPokemon,
      },
    });
  };

  it('should be defined', () => {
    const wrapper = createComponent();

    expect(wrapper).toBeDefined();
  });

  it('should render pokemon name', () => {
    const wrapper = createComponent();

    expect(wrapper.find('.pokemon-tile__name').text()).toEqual(
      mockPokemon.name
    );
  });

  it('should render pokemon sprite', () => {
    const wrapper = createComponent();

    expect(wrapper.find('img').attributes('src')).toEqual(
      mockPokemon.sprites.front_default
    );
  });

  it('should render pokemon id', () => {
    const wrapper = createComponent();

    expect(wrapper.find('.pokemon-tile__id').text()).toEqual(mockPokemonId);
  });

  /** Add width tests! */
});

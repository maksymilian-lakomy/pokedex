import { shallowMount } from '@vue/test-utils';

import PokemonTileComponent from '@/components/pokemon-tile.component.vue';
import { PokemonsReferencePage } from '@/models';
import { PokemonSpritesService } from '@/services';

type ExtendedPokemon = PokemonsReferencePage.PokemonExtendedReferenceModel;

describe('PokemonTileComponent', () => {
  const mockPokemonId = 'idMock';
  const mockPokemonURL = `https://pokeapi.co/api/v2/pokemon/${mockPokemonId}/`;

  const mockId = 'mockId';

  const mockPokemon: ExtendedPokemon = {
    name: 'pokemonNameMock',
    url: mockPokemonURL,
    id: mockId,
    sprites: PokemonSpritesService.getSprites(mockId),
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

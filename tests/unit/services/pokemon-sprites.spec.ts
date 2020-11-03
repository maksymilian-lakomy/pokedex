import { PokemonSpritesService } from '@/services/pokemon-sprites.service';

describe(`PokemonSpritesService`, () => {
  it('should return front_default & back_default sprites', () => {
    const mockPokemonURL = 'https://pokeapi.co/api/v2/pokemon/mock/';

    const result = PokemonSpritesService.getSprites(mockPokemonURL);

    expect(result).toHaveProperty('front_default');
    expect(result).toHaveProperty('back_default');
  });

  it('shoud have pokemon id inside sprites url', () => {
    const mockPokemonId = 'mock';

    const result = PokemonSpritesService.getSprites(mockPokemonId);

    Object.values(result).forEach(pokemonURL => {
      expect(pokemonURL).toContain(mockPokemonId);
    })
  });
});

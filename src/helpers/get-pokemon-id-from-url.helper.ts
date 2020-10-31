export const getPokemonIdFromUrl = (pokemonURL: string) => {
  const pokemonURLsplitted = pokemonURL.split('/');
  const pokemonIndex =
    pokemonURLsplitted[
      pokemonURLsplitted.length - (pokemonURL.endsWith('/') ? 2 : 1)
    ];

  return pokemonIndex;
};

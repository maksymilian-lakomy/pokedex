export const pokemonName = (value: string): string => {
  return `${value[0].toUpperCase()}${value.replace('-', ' ').slice(1)}`;
};

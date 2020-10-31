export const calculatePokemonSpriteWidth = (
  spriteWrapper: Element,
  originalSpriteResolution = 96
): number => {
  const { clientWidth } = spriteWrapper;
  const factor = clientWidth / originalSpriteResolution;

  return originalSpriteResolution * Math.floor(factor);
};

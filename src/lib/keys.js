/**
 * A "line" is a single product+variant combination. Quantities are tracked per
 * line so Red and Blue of the same product keep independent counts.
 *
 * Products without variants use just their product id as the key.
 */
const SEP = '::';

export function lineKey(productId, variantId = null) {
  return variantId ? `${productId}${SEP}${variantId}` : productId;
}

export function parseLineKey(key) {
  const [productId, variantId = null] = key.split(SEP);
  return { productId, variantId };
}

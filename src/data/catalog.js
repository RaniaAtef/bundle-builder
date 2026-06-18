import catalogData from './catalog.json';

export function createCatalog(data) {
  const steps = Array.isArray(data?.steps) ? data.steps : [];
  const reviewGroupOrder = Array.isArray(data?.reviewGroupOrder)
    ? data.reviewGroupOrder
    : [];
  const products = {};
  const productStep = {};

  for (const step of steps) {
    for (const product of step.products ?? []) {
      products[product.id] = product;
      productStep[product.id] = step;
    }
  }

  return {
    steps,
    reviewGroupOrder,
    products,
    productStep,
  };
}

export const LOCAL_CATALOG = createCatalog(catalogData);

export async function loadCatalog() {
  const response = await fetch('/api/catalog');

  if (!response.ok) {
    throw new Error('Catalog API request failed.');
  }

  return createCatalog(await response.json());
}

export function getProduct(catalog, productId) {
  return catalog.products[productId] ?? null;
}

export function getVariant(product, variantId) {
  if (!product?.variants || !variantId) return null;
  return product.variants.find((variant) => variant.id === variantId) ?? null;
}

export function defaultVariantId(product) {
  return product?.variants?.[0]?.id ?? null;
}

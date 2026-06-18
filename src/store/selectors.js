import {
  LOCAL_CATALOG,
  getProduct,
  getVariant,
  defaultVariantId,
} from '../data/catalog';
import { lineKey, parseLineKey } from '../lib/keys';


/** The variant a card currently displays (falls back to the first one). */
export function activeVariantId(state, product) {
  if (!product?.variants) return null;
  return state.selectedVariant[product.id] ?? defaultVariantId(product);
}

/** Quantity for the variant the card is currently showing. */
export function productQty(state, product) {
  const variantId = activeVariantId(state, product);
  return state.quantities[lineKey(product.id, variantId)] ?? 0;
}

/** A product counts as "selected" if any of its variants has a quantity. */
export function isProductSelected(state, product) {
  if (product.variants) {
    return product.variants.some(
      (v) => (state.quantities[lineKey(product.id, v.id)] ?? 0) > 0,
    );
  }
  return (state.quantities[lineKey(product.id)] ?? 0) > 0;
}

/** Distinct products chosen in a step — drives the "N selected" counter. */
export function stepSelectedCount(state, step) {
  if (step.select === 'single') {
    return step.products.some((p) => p.id === state.selectedPlanId) ? 1 : 0;
  }
  return step.products.reduce(
    (count, product) => count + (isProductSelected(state, product) ? 1 : 0),
    0,
  );
}

/* ---- Review panel ------------------------------------------------------- */

function makeLine(product, variant, qty, { editable, perMonth = false }) {
  const reviewPrice = product.reviewPrice ?? product.price;
  const unit = reviewPrice.active;
  const compareAt = reviewPrice.compareAt ?? unit;
  return {
    key: lineKey(product.id, variant?.id ?? null),
    productId: product.id,
    variantId: variant?.id ?? null,
    product,
    variant,
    name: product.title,
    qty,
    unit,
    compareAt,
    lineTotal: unit * qty,
    editable,
    perMonth,
  };
}

/**
 * Builds the review panel model: every variant with qty > 0 becomes its own
 * line, grouped under its category subheading, plus the selected plan.
 */
export function buildReviewGroups(state, catalog = LOCAL_CATALOG) {
  const byGroup = new Map();
  const productOrder = {};
  const variantOrder = {};
  const push = (group, line) => {
    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group).push(line);
  };

  catalog.steps.forEach((step) => {
    step.products.forEach((product, productIndex) => {
      productOrder[product.id] = productIndex;
      (product.variants ?? []).forEach((variant, variantIndex) => {
        variantOrder[`${product.id}:${variant.id}`] = variantIndex;
      });
    });
  });

  for (const [key, qty] of Object.entries(state.quantities)) {
    if (!qty) continue;
    const { productId, variantId } = parseLineKey(key);
    const product = getProduct(catalog, productId);
    if (!product) continue; // stale key from an older catalog — skip it
    const variant = getVariant(product, variantId);
    if (variantId && product.variants && !variant) continue;
    push(catalog.productStep[productId].reviewGroup, makeLine(product, variant, qty, { editable: true }));
  }

  const plan = getProduct(catalog, state.selectedPlanId);
  if (plan) {
    push('Plan', makeLine(plan, null, 1, { editable: false, perMonth: true }));
  }

  for (const lines of byGroup.values()) {
    lines.sort((a, b) => {
      const byProduct = productOrder[a.productId] - productOrder[b.productId];
      if (byProduct !== 0) return byProduct;
      const av = variantOrder[`${a.productId}:${a.variantId}`] ?? 0;
      const bv = variantOrder[`${b.productId}:${b.variantId}`] ?? 0;
      return av - bv;
    });
  }

  return catalog.reviewGroupOrder.filter((group) => byGroup.has(group)).map((group) => ({
    group,
    lines: byGroup.get(group),
  }));
}

/* Totals */

/**
 * Money math runs in integer cents. Pass the already-built groups to avoid
 * recomputing them.
 */
export function computeTotals(groups) {
  let total = 0;
  let preDiscount = 0;
  let itemCount = 0;

  for (const { lines } of groups) {
    for (const line of lines) {
      total += line.unit * line.qty;
      preDiscount += line.compareAt * line.qty;
      itemCount += line.qty;
    }
  }

  return {
    total,
    preDiscount,
    savings: Math.max(0, preDiscount - total),
    financingMonthly: Math.round(total / 12),
    itemCount,
  };
}

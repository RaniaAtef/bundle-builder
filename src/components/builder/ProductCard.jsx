import { activeVariantId, isProductSelected, productQty } from '../../store/selectors';
import { formatPerMonth, formatPriceCompact } from '../../lib/format';
import { useSystem } from '../../hooks/useSystem';
import QuantityStepper from './QuantityStepper';
import VariantSelector from './VariantSelector';

export default function ProductCard({ product, step, isPlanSelected }) {
  const { state, actions } = useSystem();
  const isCameraStep = step.id === 'cameras';
  const variantId = activeVariantId(state, product);
  const variant = product.variants?.find((item) => item.id === variantId) ?? null;
  const qty = productQty(state, product);
  const selected = step.select === 'single' ? isPlanSelected : isProductSelected(state, product);
  const price = step.select === 'single' ? formatPerMonth : formatPriceCompact;

  const setQty = (nextQty) => actions.setQty(product.id, variantId, nextQty);

  return (
    <article
      className={`relative flex h-full flex-col rounded-[8px] border-2 bg-white ${
        selected ? 'border-[#7c63ee]' : 'border-transparent'
      } ${isCameraStep ? 'min-h-[162px] p-3' : 'min-h-[210px] p-3'}`}
    >
      {product.badge ? (
        <span className="absolute left-3 top-3 rounded-pill bg-badge px-2 py-1 text-[11px] leading-none font-semibold text-white">
          {product.badge}
        </span>
      ) : null}

      <div
        className={`grid flex-1 gap-3 ${
          isCameraStep ? 'grid-cols-[125px_minmax(0,1fr)]' : 'grid-cols-1'
        }`}
      >
        <div
          className={`flex items-center justify-center ${
            isCameraStep ? 'h-[112px] pt-7' : 'mx-auto h-[112px] w-[112px]'
          }`}
        >
          <img
            src={product.image ?? variant?.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <h3
            className={`font-semibold leading-tight text-ink ${
              isCameraStep ? 'text-[16px]' : 'text-[20px]'
            }`}
          >
            {product.title}
          </h3>
          <p
            className={`mt-1 text-ink-soft ${
              isCameraStep ? 'text-[13px] leading-[1.25]' : 'text-[15px] leading-[1.3]'
            }`}
          >
            {product.description}
          </p>

          {product.variants?.length ? (
            <div className="mt-2">
              <VariantSelector
                product={product}
                activeId={variantId}
                onSelect={(nextVariantId) => actions.selectVariant(product.id, nextVariantId)}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`mt-3 ${
          isCameraStep ? 'grid grid-cols-[125px_minmax(0,1fr)] gap-3' : 'flex items-end justify-between gap-3'
        }`}
      >
        {isCameraStep ? <span /> : null}
        <div className="flex flex-1 items-end justify-between gap-3">
          {step.select === 'single' ? (
            <button
              type="button"
              onClick={() => actions.selectPlan(product.id)}
              className={`rounded-[6px] px-3 py-2 text-sm font-medium transition ${
                isPlanSelected
                  ? 'bg-accent text-white'
                  : 'border border-line bg-white text-ink hover:border-accent hover:text-accent'
              }`}
            >
              {isPlanSelected ? 'Selected plan' : 'Choose plan'}
            </button>
          ) : (
            <QuantityStepper
              value={qty}
              onChange={setQty}
              label={`${product.title} quantity`}
            />
          )}

          <div className="shrink-0 text-right">
            {product.price.compareAt ? (
              <p className="text-[16px] leading-none text-[#e0312a] line-through decoration-[#e0312a]">
                {price(product.price.compareAt)}
              </p>
            ) : null}
            <p className="mt-1 text-[16px] leading-none font-medium text-ink-soft">
              {price(product.price.active)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

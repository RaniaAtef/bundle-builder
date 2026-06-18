export default function VariantSelector({ product, activeId, onSelect }) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-2 items-center overflow-x-auto">
      {product.variants.map((variant) => {
        const selected = variant.id === activeId;

        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            className={`inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-sm transition flex-shrink-0 ${
                selected
                  ? 'border-2 border-[#8eeadf] bg-[#fafffe] text-ink'
                  : 'border border-[#d8dce4] bg-white text-ink hover:border-accent'
              }`}
            aria-pressed={selected}
            aria-label={variant.label}
          >
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white">
              {variant.image ? (
                <img
                  src={variant.image}
                  alt={variant.label}
                  className="h-[18px] w-[18px] rounded object-contain"
                />
              ) : (
                <span
                  className="h-3.5 w-3.5 rounded-full shadow-inner"
                  style={{ backgroundColor: variant.swatch }}
                  aria-hidden="true"
                />
              )}
            </span>
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}

import { ShieldCheck } from 'lucide-react';
import { formatPerMonth, formatPriceCompact } from '../../lib/format';
import { useSystem } from '../../hooks/useSystem';
import QuantityStepper from '../builder/QuantityStepper';

function formatReviewPrice(cents, perMonth = false) {
  if (cents === 0) return 'FREE';
  return perMonth ? formatPerMonth(cents) : formatPriceCompact(cents);
}

function ReviewLine({ line, onQtyChange }) {
  const imageSrc = line.product.image ?? line.variant?.image;

  return (
    <article key={line.key} className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3">
      <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-[6px] bg-white p-1">
        <img
          src={imageSrc}
          alt={line.name}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] leading-[1.1] font-medium text-ink">
              {line.name}
            </p>
            {line.variant ? (
              <p className="mt-1 text-[11px] leading-none text-ink-soft">
                {line.variant.label}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-3.5">
            {line.editable ? (
              <QuantityStepper
                size="sm"
                value={line.qty}
                onChange={(qty) => onQtyChange(line, qty)}
                label={`${line.name} quantity`}
              />
            ) : null}

            <div className="w-[58px] text-right">
              {line.compareAt > line.unit ? (
                <p className="text-[12px] text-[#7f8794] line-through">
                  {line.perMonth
                    ? formatPerMonth(line.compareAt)
                    : formatPriceCompact(line.compareAt)}
                </p>
              ) : null}
              <p className="text-[13px] font-semibold leading-tight text-accent">
                {formatReviewPrice(line.lineTotal, line.perMonth)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ReviewPanel({
  groups,
  totals,
  onCheckout,
  onSave,
  savedMessage,
  checkoutMessage,
}) {
  const { actions } = useSystem();
  const updateLineQty = (line, qty) => {
    actions.setQty(line.productId, line.variantId, qty);
  };

  return (
    <aside className="top-[44px] h-fit bg-[#edf4ff] p-5 xl:sticky xl:rounded-[8px]">
      <div className="border-b border-[#cad3df] pb-[16px]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">Review</p>
        <h2 className="mt-[25px] text-[24px] leading-none font-semibold tracking-[-0.01em] text-ink">
          Your security system
        </h2>
        <p className="mt-[10px] text-[15px] leading-[1.25] text-ink-soft">
          Review your personalized protection system designed to keep what matters most safe.
        </p>
      </div>

      <div className="mt-[17px] space-y-3">
        {groups.map(({ group, lines }) => (
          <section key={group}>
            <h3 className="text-[11px] uppercase tracking-[0.08em] text-[#b0b7c3]">
              {group}
            </h3>
            <div className="mt-2 space-y-3 border-b border-[#cad3df] pb-[14px]">
              {lines.map((line) => (
                <ReviewLine key={line.key} line={line} onQtyChange={updateLineQty} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-3 space-y-3 text-sm">
        <div className="flex items-center justify-between border-b border-[#cad3df] pb-3">
          <div className="flex items-center gap-3">
            <div className="grid h-[42px] w-[42px] place-items-center rounded-[6px] bg-white text-[#0fb3a3]">
              <img src="/images/delivery.png" alt="Fast shipping" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-[15px] font-medium text-ink">Fast Shipping</span>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-[#7f8794] line-through">$5.99</p>
            <p className="text-[12px] font-semibold text-accent">FREE</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 pt-1">
          <img
            src="/images/satisfaction-badge.png"
            alt="Wyze satisfaction guarantee badge"
            className="h-[74px] w-[74px] object-contain"
          />

          <div className="text-right">
            <div className="mb-3 inline-flex rounded-[3px] bg-accent px-2 py-1 text-[11px] font-medium text-white">
              as low as {formatPerMonth(totals.financingMonthly)}
            </div>
            <div>
              {totals.preDiscount > totals.total ? (
                <p className="text-[16px] leading-none text-[#7f8794] line-through">
                  {formatPriceCompact(totals.preDiscount)}
                </p>
              ) : null}
              <p className="mt-1 text-[25px] leading-none font-semibold text-accent">
                {formatPriceCompact(totals.total)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3  text-center text-[13px] font-medium text-bold text-savings">
          Congrats! You&apos;re saving {formatPriceCompact(totals.savings)} on your security bundle!
        </p>
      </div>

      <div className="mt-2 space-y-2">
        <button
          type="button"
          onClick={onCheckout}
          className="h-[50px] w-full rounded-[4px] bg-accent px-4 text-[18px] font-semibold text-white transition hover:bg-accent-ink"
        >
          Checkout
        </button>
        <button
          type="button"
          onClick={onSave}
          className="w-full bg-transparent px-4 py-1 text-[14px] text-[#5b6472] underline underline-offset-2 transition hover:text-accent"
        >
          Save my system for later
        </button>
        {savedMessage ? (
          <p className="inline-flex items-start gap-2 text-[13px] text-ink-soft">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {savedMessage}
          </p>
        ) : null}
        {checkoutMessage ? (
          <p className="text-[13px] text-ink-soft">{checkoutMessage}</p>
        ) : null}
      </div>
    </aside>
  );
}

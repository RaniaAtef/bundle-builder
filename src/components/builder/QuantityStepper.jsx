import { Minus, Plus } from 'lucide-react';

/**
 * Quantity control used on both product cards and review lines. The minus
 * button disables at `min` (the disabled-stepper state from the design).
 */
export default function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'md',
  label = 'quantity',
}) {
  const small = size === 'sm';
  const atMin = value <= min;
  const atMax = value >= max;

  const button =
    'grid shrink-0 place-items-center rounded-[5px] border border-transparent bg-[#f3f4f6] text-[#808796] transition ' +
    'enabled:hover:border-accent enabled:hover:text-accent ' +
    'disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#c2c8d0] ' +
    (small ? 'h-[18px] w-[18px]' : 'h-5 w-5');

  const icon = small ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <div
      className="inline-flex items-center gap-2.5"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={button}
        onClick={() => onChange(value - 1)}
        disabled={atMin}
        aria-label={`Decrease ${label}`}
      >
        <Minus className={icon} strokeWidth={2.5} />
      </button>
      <span
        className="min-w-[0.85rem] text-center text-[15px] font-medium tabular-nums text-ink"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        aria-label={`Increase ${label}`}
      >
        <Plus className={icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}

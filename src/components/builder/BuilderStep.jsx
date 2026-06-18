import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSystem } from '../../hooks/useSystem';
import ProductCard from './ProductCard';

export default function BuilderStep({
  step,
  index,
  isOpen,
  selectedCount,
  onToggle,
  onNext,
}) {
  const { state } = useSystem();
  const isCameraStep = step.id === 'cameras';
  const centerLastCard = isCameraStep && step.products.length % 2 === 1;

  return (
    <section
      className={
        isOpen
          ? 'overflow-hidden rounded-[8px] bg-[#edf4ff]'
          : 'mt-[14px] bg-white'
      }
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
        aria-expanded={isOpen}
      >
        <div
          className={
            isOpen
              ? 'border-b border-[#7f8792] px-4 pb-[7px] pt-[13px]'
              : 'border-b border-[#8f949b] px-4 pb-[7px] pt-0'
          }
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#4f5358]">
            Step {index + 1} of 4
          </p>
        </div>

        <div
          className={`flex items-center gap-3 px-4 ${
            isOpen
              ? 'pb-[12px] pt-[20px]'
              : 'border-b border-[#8f949b] pb-[24px] pt-[19px]'
          }`}
        >
          <img
            src={step.icon}
            alt=""
            aria-hidden="true"
            className="h-[30px] w-[30px] shrink-0 object-contain"
          />
          <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
            <h2 className="text-[25px] font-semibold tracking-[-0.01em] text-ink">
              {step.title}
            </h2>

            <div className="flex items-center gap-1.5 pl-3 text-accent">
              {isOpen ? (
                <span className="text-[16px] font-medium">
                  {selectedCount} selected
                </span>
              ) : null}
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </button>

      {isOpen ? (
        <div className="px-4 pb-[22px] pt-0">
          <div
            className={
              isCameraStep
                ? 'grid gap-4 md:grid-cols-2'
                : 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
            }
          >
            {step.products.map((product, productIndex) => {
              const isCentered =
                centerLastCard && productIndex === step.products.length - 1;

              return (
                <div
                  key={product.id}
                  className={isCentered ? 'md:col-span-2 md:mx-auto md:w-[372px]' : ''}
                >
                  <ProductCard
                    step={step}
                    product={product}
                    isPlanSelected={state.selectedPlanId === product.id}
                  />
                </div>
              );
            })}
          </div>

          {onNext ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onNext}
                className="h-[40px] rounded-[6px] border border-accent px-9 text-[18px] font-medium text-accent transition hover:bg-accent-soft"
              >
                {step.nextLabel}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

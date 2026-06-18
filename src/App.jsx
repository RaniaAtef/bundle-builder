import { useMemo, useState } from 'react';
import { STEPS } from './data/catalog';
import { useSystem } from './hooks/useSystem';
import { SystemProvider } from './store/SystemContext';
import { stepSelectedCount, buildReviewGroups, computeTotals } from './store/selectors';
import BuilderStep from './components/builder/BuilderStep';
import ReviewPanel from './components/review/ReviewPanel';

function AppContent() {
  const { state, actions, save, wasRestored } = useSystem();
  const [savedMessage, setSavedMessage] = useState(
    wasRestored ? 'Saved system restored from your last visit.' : '',
  );
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const reviewGroups = useMemo(() => buildReviewGroups(state), [state]);
  const totals = useMemo(() => computeTotals(reviewGroups), [reviewGroups]);

  const handleSave = async () => {
    const bundle = await save();

    if (!bundle) {
      setSavedMessage('Saving failed in this browser session.');
      return;
    }

    if (bundle.localOnly) {
      setSavedMessage('System saved in this browser. Reload and it will restore exactly as-is.');
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('bundle', bundle.id);
    setSavedMessage(
      `System saved. Share or revisit this link: ${url.toString()}`,
    );
  };

  const handleCheckout = () => {
    setCheckoutMessage('Prototype checkout only. This screen is focused on the builder flow.');
  };

  return (
    <main className="min-h-screen bg-white text-ink">
      <div className="mx-auto max-w-[1234px] px-4 py-8 sm:px-6 lg:px-0 lg:py-[44px]">
        <section className="grid gap-[30px] xl:grid-cols-[792px_412px]">
          <div>
            {STEPS.map((step, index) => (
              <BuilderStep
                key={step.id}
                step={step}
                index={index}
                selectedCount={stepSelectedCount(state, step)}
                isOpen={state.openStepId === step.id}
                onToggle={() => actions.toggleStep(step.id)}
                onNext={
                  index < STEPS.length - 1
                    ? () => actions.openStep(STEPS[index + 1].id)
                    : null
                }
              />
            ))}
          </div>

          <ReviewPanel
            groups={reviewGroups}
            totals={totals}
            onCheckout={handleCheckout}
            onSave={handleSave}
            savedMessage={savedMessage}
            checkoutMessage={checkoutMessage}
          />
        </section>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}

import type { ReactNode } from 'react';

type AppShellProps = {
  savedCount: number;
  online: boolean;
  children: ReactNode;
};

const AppShell = ({ savedCount, online, children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-tru-cloud text-tru-blue [background-image:radial-gradient(1200px_600px_at_8%_-10%,#bad1ba,transparent),radial-gradient(900px_500px_at_92%_0%,#ffcd00,transparent)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 pb-28 pt-6 sm:px-6">
        <header className="rounded-xl border border-tru-sage bg-white/90 p-5 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tru-grey">
                TRU Inclusive & Accessible Spaces
              </p>
              <h1 className="text-2xl font-semibold sm:text-3xl text-tru-blue">TRU Accessibility Audit</h1>
              <p className="mt-1 text-sm text-tru-grey">Building-by-building, floor-by-floor</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-tru-sage px-3 py-1 text-xs font-semibold text-tru-blue">
                Saved entries: {savedCount}
              </span>
              {!online ? (
                <span className="rounded-full border border-tru-yellow bg-tru-cloud px-3 py-1 text-xs font-semibold text-tru-blue">
                  Offline mode
                </span>
              ) : null}
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default AppShell;

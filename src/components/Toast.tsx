type ToastProps = {
  message: string;
  visible: boolean;
  onUndo?: () => void;
};

const Toast = ({ message, visible, onUndo }: ToastProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed left-4 right-4 top-4 z-40 mx-auto max-w-sm rounded-xl border border-tru-sage bg-white px-4 py-3 text-sm shadow-soft sm:left-auto sm:right-4 sm:mx-0"
      style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
    >
      <div className="flex items-center gap-3">
        <span className="font-semibold text-tru-blue">{message}</span>
        {onUndo ? (
          <button
            type="button"
            onClick={onUndo}
            className="rounded-full border border-tru-teal bg-tru-yellow px-3 py-1 text-xs font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
          >
            Undo
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Toast;

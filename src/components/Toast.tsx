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
    <div className="fixed right-4 top-4 z-40 rounded-xl border border-tru-sage bg-white px-4 py-3 text-sm shadow-soft" aria-live="polite">
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

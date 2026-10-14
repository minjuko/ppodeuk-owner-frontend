import { useId } from "react";
import { createPortal } from "react-dom";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  pendingLabel = "처리 중...",
  isPending = false,
  danger = false,
  onConfirm,
  onClose,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl"
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <p
          id={descriptionId}
          className="mt-3 text-gray-600 whitespace-pre-line"
        >
          {message}
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            aria-busy={isPending}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-60 ${
              danger ? "bg-red-600" : "bg-primary"
            }`}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;

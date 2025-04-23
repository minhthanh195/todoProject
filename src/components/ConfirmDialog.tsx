"use client";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
        <p className="text-gray-800 dark:text-gray-100 mb-4 text-center">
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

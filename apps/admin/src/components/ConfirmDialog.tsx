import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onCancel}>
      <div 
        className="bg-zinc-900 rounded-2xl w-full max-w-sm p-6 flex flex-col items-center text-center shadow-xl animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-brand-fire/20 text-brand-fire'}`}>
          <AlertTriangle className="w-7 h-7" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-8">{message}</p>
        
        <div className="flex w-full gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white border border-border-subtle transition-colors"
          >
            {cancelLabel}
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-fire hover:bg-[#ff571a]'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// import React from "react";
// interface EditMessageFormProps {
//   initialText: string;
//   onSave: (newText: string) => void;
//   onCancel: () => void;
// }
// const EditMessageForm: React.FC<EditMessageFormProps> = ({
//   initialText,
//   onSave,
//   onCancel,
// }) => {
//   const [editText, setEditText] = React.useState(initialText);
//   const textareaRef = React.useRef<HTMLTextAreaElement>(null);
//   // Automatically focus and select the text when the component mounts
//   React.useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.focus();
//       textareaRef.current.select();
//     }
//   }, []);
//   const handleSave = () => {
//     if (editText.trim() && editText.trim() !== initialText) {
//       onSave(editText.trim());
//     } else {
//       onCancel(); // Cancel if text is empty or unchanged
//     }
//   };
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSave();
//     }
//     if (e.key === "Escape") {
//       onCancel();
//     }
//   };

//   return (
//     <div className="flex w-full flex-col gap-2">
//       <textarea
//         ref={textareaRef}
//         value={editText}
//         onChange={(e) => setEditText(e.target.value)}
//         onKeyDown={handleKeyDown}
//         className="w-full rounded-md border bg-[rgba(0,0,0,0.7)] p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
//         rows={3}
//       />
//       <div className="flex justify-end gap-2 text-xs">
//         <button
//           onClick={onCancel}
//           className="font-semibold text-gray-400 hover:underline"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSave}
//           className="rounded-md bg-green-600 px-3 py-1 font-semibold text-white hover:bg-green-700"
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditMessageForm;

import React from "react";
import { Check, X, RotateCcw } from "lucide-react";

interface EditMessageFormProps {
  initialText: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

const EditMessageForm: React.FC<EditMessageFormProps> = ({
  initialText,
  onSave,
  onCancel,
}) => {
  const [editText, setEditText] = React.useState(initialText);
  const [isSaving, setIsSaving] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Automatically focus and select the text when the component mounts
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      // Auto-resize textarea
      adjustTextareaHeight();
    }
  }, []);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleSave = async () => {
    const trimmedText = editText.trim();
    
    if (!trimmedText) {
      // Shake animation for empty text
      textareaRef.current?.classList.add('animate-shake');
      setTimeout(() => {
        textareaRef.current?.classList.remove('animate-shake');
      }, 500);
      return;
    }
    
    if (trimmedText === initialText.trim()) {
      onCancel(); // Cancel if text is unchanged
      return;
    }

    setIsSaving(true);
    try {
      await onSave(trimmedText);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEditText(initialText);
    textareaRef.current?.focus();
    setTimeout(adjustTextareaHeight, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
    adjustTextareaHeight();
  };

  const hasChanged = editText.trim() !== initialText.trim();
  const isEmpty = !editText.trim();
  const charCount = editText.length;
  const maxChars = 2000; // character limit

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl z-30 rounded-lg">
      {/* Backdrop blur overlay */}
      {/* <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg -m-2 bg-green-500"></div> */}
      
      <div className="relative px-5 flex w-full flex-col gap-3 p-3 bg-gradient-to-br bg-[rgba(0,0,0,0.5)] backdrop-blur-md border border-yellow-500/30 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-amber-400">Editing message</span>
          </div>
          {hasChanged && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors duration-200"
              title="Reset to original"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className={`w-full resize-none rounded-lg border-2 bg-black/40 backdrop-blur-sm p-3 text-sm text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed ${
              isEmpty ? 'border-red-400/50 focus:border-red-400' : 'border-gray-600/50'
            }`}
            placeholder="Type your message..."
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
            maxLength={maxChars}
          />
          
          {/* Character counter */}
          <div className={`absolute bottom-1 right-2 text-xs transition-colors duration-200 ${
            charCount > maxChars * 0.9 ? 'text-red-400' : 'text-gray-500'
          }`}>
            {charCount}/{maxChars}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 hidden md:block">
            <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">Enter</kbd> to save •
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="group flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving || isEmpty || !hasChanged}
              className={`group flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white transition-all duration-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
                isEmpty || !hasChanged
                  ? 'bg-gray-600/50'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} className="group-hover:scale-110 transition-transform duration-200" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status indicators */}
        {hasChanged && !isEmpty && (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span className="text-green-400">Ready to save changes</span>
          </div>
        )}
        
        {isEmpty && (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-400">Message cannot be empty</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EditMessageForm;
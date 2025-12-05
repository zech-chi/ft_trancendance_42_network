// this component will be responsible for deleting a message

import React from 'react';

type DeleteConfirmationProps = {
  messageType: 'text' | 'image' | 'file' | 'audio';
  // Function to call when the user confirms the deletion
  onConfirm: () => void;
  // Function to call when the user cancels
  onCancel: () => void;
}

export const DeleteConfirmation = ({ messageType, onConfirm, onCancel }: DeleteConfirmationProps) => {
  const getMessageTypeName = () => {
    if (messageType === 'text') return 'message';
    return messageType;
  };

  return (
    // This is the full-screen overlay inside the message bubble
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  inset-0 z-50 flex items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-800/100 border border-white/20 p-4">
        <h3 className="font-semibold text-white">Delete {getMessageTypeName()}?</h3>
        <p className="text-center text-sm text-gray-300">
          Are you sure you want to delete this {getMessageTypeName()}? <br /> This action cannot be undone.
        </p>
        <div className="mt-2 flex w-full justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-[#FFB700] px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
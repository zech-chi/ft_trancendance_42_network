// confirmation block component

import { Contact } from "@/app/protected/chat/types/typesChat";

type ConfirmationBlockProps = {
  onCancel: () => void;
  onConfirmBlock: () => void;
  onConfirmUnblock: () => void;
  contact: Contact;
};

export const ConfirmationBlock = ({
  onCancel,
  onConfirmBlock,
  onConfirmUnblock,
  contact,
}: ConfirmationBlockProps) => {
  const title = contact.blocked ? "unblock" : "block";
  const message = contact.blocked
    ? "Are you sure you want to unblock this person You will be able to send or receive messages from them."
    : "Are you sure you want to block this person You will no longer be able to send or receive messages from them.";

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 rounded-[50px] animate-fade-in">
      <div className="bg-[rgba(0,0,0,0.5)] border border-yellow-500/30 p-6 rounded-lg shadow-lg max-w-[300px] md:max-w-sm w-full backdrop-blur-2xl">
        <h2 className="text-[16px] md:text-xl font-semibold mb-4 text-white">{`${title} ${contact.name}`}</h2>
        <p className="mb-6 text-sm text-white">{`${message}`}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          {contact.blocked !== true ? (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={onConfirmBlock}
            >
              Block
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={onConfirmUnblock}
            >
              UnBlock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

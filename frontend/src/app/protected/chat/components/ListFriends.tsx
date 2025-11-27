"use client";

import { Search, User } from "lucide-react";

import { useEffect, useState } from "react";
import { ListFriendsProps, Message } from "../types/typesChat";
import { formatLengthNameUser } from "../utils/formatLengthNameUser"; // Import the utility function for formatting names
import { useSocket } from "../context/SocketContext";
import Image from "next/image";

// type updateMessage = {
//   deleted: boolean;
//   edited: boolean;
//   id: number;
// }

function ListFriends({
  contactsList,
  setContactsList,
  handleSearchChange,
  searchQuery,
  setSearchQuery,
  showSidebar,
  setShowSidebar,
  selectedChat,
  setSelectedChat,
  reorderContacts,
  updateMessage,
  setUpdateMessage,
}: ListFriendsProps) {

  // state for tracking the update of deleting or editing a message
  const {socket} = useSocket();

  useEffect(() => {
  if (!socket) return;

  console.warn("Socket is lisning on listFrineds:", socket.id);

  const handleIncomingMessage = (message: Message) => {
    console.warn("Received message:========>", message);
    const contactIndex = contactsList.findIndex((c) => c.id == message.from || c.id == message.to);
    if (contactIndex === -1) return;
    contactsList[contactIndex].lastMessage = {
      content: message.message ?? "",
      type: message.type,
    };
    reorderContacts(contactsList[contactIndex].id); // Reorder the contact to the top

    // reset updateMessage state
    setUpdateMessage({ deleted: false, edited: false, id: -1 });
  };


  const handleBlockUser = ({ userId, friendId }: { userId: number; friendId: number }) => {
    console.warn("Handling block event for friend:", friendId);
    // Use the functional update form to avoid stale state.
    setContactsList(prevContacts => {
      // Create a new array using .map()
      return prevContacts.map(contact => {
        // If this is the contact to block, create a new object for them
        if (contact.id == friendId || contact.id == userId) {
          alert(`You have been blocked by ${contact.name}`);
          return { ...contact, blocked: true , blockedBy: userId }; //! to change to friendId
        }
        // Otherwise, return the contact unchanged
        return contact;
      });
    });
  };

  const handleUnblockUser = ({ userId, friendId }: { userId: number; friendId: number }) => {
    console.warn("Handling unblock event for friend:", friendId);
    setContactsList(prevContacts => 
      prevContacts.map(contact => 
       ( contact.id == friendId || contact.id == userId) ? { ...contact, blocked: false, blockedBy: undefined } : contact
      )
    );
  };


  const handleDeleteMessage = ({from, userId}: {from: number, userId: number}) => {
    // Check if the message belongs to the current contact
    setContactsList(prevContacts =>
      prevContacts.map(contact =>
        (contact.id == from || contact.id == userId)
          ? {
              ...contact,
              lastMessage: {
                ...(contact.lastMessage || { type: 'text', content: '' }),
                content: "A message was deleted",
              }
            }
          : contact
      )
    );

    setUpdateMessage(prevState => ({deleted: true, edited: false, id: from}));
  }

  const handleUpdateMessage = ({from, userId}: {from: number, userId: number}) => {
    setContactsList(prevContacts =>
      prevContacts.map(contact =>
        (contact.id == from || contact.id == userId)
          ? {
              ...contact,
              lastMessage: {
                ...(contact.lastMessage || { type: 'text', content: '' }),
                content: "A message was edited",
              }
            }
          : contact
      )
    );

    setUpdateMessage(prevState => ({deleted: false, edited: true, id: from}));
  }

  socket.on("receive-message", handleIncomingMessage);
  socket.on("blockUser", handleBlockUser);
  socket.on("unblockUser", handleUnblockUser);
  socket.on("editMessage", handleUpdateMessage);
  socket.on("deleteMessage", handleDeleteMessage);

  return () => {
    socket.off("receive-message", handleIncomingMessage);
    socket.off("blockUser", handleBlockUser);
    socket.off("unblockUser", handleUnblockUser);
    socket.off("editMessage", handleUpdateMessage);
    socket.off("deleteMessage", handleDeleteMessage);
  };
}, [socket, selectedChat?.id, contactsList]);


  return (
    // sidebar for list friends
    <div
      className={`md:max-w-[400px] w-full m-0 p-4 transform transition-transform duration-300 ease-in-out 
        lg:relative lg:translate-x-0 lg:top-0 lg:left-0 overflow-hidden
        bg-gray-800/40 backdrop-blur-md p-6 shadow-xl border border-white/20 rounded-2xl
        ${
          showSidebar
            ? "translate-x-0 left-0 top-4 absolute p-2 bg-[rgba(0,0,0,0.8)] backdrop-blur-md z-20"
            : "-translate-x-full absolute left-0 top-0 h-full"
        }`}
    >
      {/* search input */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-[#B2B2B2] w-5 h-5" />
          <input
            type="text"
            placeholder="Search ..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 p-2 rounded-[50px]
             text-[#B2B2B2] placeholder-[#B2B2B2]
             bg-[rgba(7,0,0,0.6)] border border-white/30
             focus:outline-none focus:ring-2 focus:ring-[#1CBABA]/80 focus:ring-opacity-20"
          />
        </div>
      </div>

      {/* list friends */}
      <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] pr-2 scrollbar">
        { contactsList.length === 0 ? (<div className="flex items-center justify-center h-full text-white">
          <User className="w-12 h-12 text-[#B2B2B2] mb-2" />
          <p className="text-[#B2B2B2]">No friends found!</p>
        </div>) : (contactsList.map((contact) => {

           let lastMessagePreview = "No messages yet.";
        if (contact.lastMessage) {
          if (contact.lastMessage.type === 'image') {
            lastMessagePreview = "📷 Photo";
          } else if (contact.lastMessage.type === 'file') {
            lastMessagePreview = "📄 File";
          } else if (contact.lastMessage.type === 'audio') {
            lastMessagePreview = "🎵 Audio";
          } else {
             const safeContent = Array.from(contact.lastMessage.content);
             lastMessagePreview = safeContent.length > 25 ? safeContent.slice(0, 22).join("") + "…" : contact.lastMessage.content;
          }
        }

          return (
          <div
            key={contact.id}
            onClick={() => {
              setSelectedChat(contact);
              setShowSidebar(false);
              setSearchQuery(""); // Clear search query when selecting a chat
              // setContactsList(saveContacts); // Reset filtered contacts
            }}
            className={`flex items-center justify-between p-2 rounded-[50px] cursor-pointer
              ${
                selectedChat?.id === contact.id
                  ? showSidebar
                    ? "bg-[#3b0430]"
                    : "bg-[rgba(14,1,1,0.6)]"
                  : ""
              }
              ${
                showSidebar && selectedChat?.id !== contact.id
                  ? "bg-[#22041c]"
                  : ""
              }
              ${
                !showSidebar && selectedChat?.id !== contact.id
                  ? "bg-[rgba(14,1,1,0.3)]"
                  : ""
              }
              ${
                selectedChat?.id !== contact.id
                  ? "hover:bg-[rgba(255,255,255,0.1)]"
                  : ""
              }
              bg-gray-800/100 backdrop-blur-md
              `}
          >
            <div className="flex items-center gap-3 relative">
              <div className="relative w-14 h-14 md:w-16 md:h-16">
                {/* <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-full h-full rounded-full border-[3px]"
                /> */}
                <Image
                  src={contact.avatar}
                  alt={contact.name}
                  fill
                  className="rounded-full border-[3px] object-cover object-center"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                    contact.online ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm md:text-base">
                  {formatLengthNameUser(contact.name, 26)}
                </h3>
                <p className="text-white text-xs md:text-sm">
                  @{contact.username}
                </p>
                <p className={`text-[#B2B2B2] ${updateMessage.deleted && updateMessage.id == contact.id ? "text-red-500" : ""} 
                    ${updateMessage.edited && updateMessage.id == contact.id ? "text-green-500" : ""} text-xs md:text-sm mt-1`}>
                  {lastMessagePreview}
                </p>
              </div>
            </div>
          </div> );
          }))}
      </div>
    </div>
  );
}

export default ListFriends;

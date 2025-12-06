"use client";

import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Message, MainChatProps } from "../types/typesChat";
import { ApiRoutes } from "../utils/ApiRoutes";
import { ImageLightbox } from "./ImageLightbox";
import { ConfirmationBlock } from "./ConfirmationBlock";
import { useSocket } from "../context/SocketContext";
import ChatInput from "./ChatInput";
import HeaderContact from "./HeaderContact";
import Messages from "./Messages";
import { useLoggedUserId } from "@/context/UserIdContext";
import { fetchWithAuth } from "@/utils/fetchWithAuth";


// this componenent will be rendring when no contact is selected
function NoContactSelected({ setShowSidebar }: { setShowSidebar: (show: boolean) => void }) {
  return (
    <div className="relative text-gray-400 h-full flex items-center flex-col gap-5 justify-center">
      <button
        onClick={() => setShowSidebar(true)}
        className="text-white lg:hidden absolute top-6 left-5 cursor-pointer"
      >
        <ArrowLeft className="w-7 h-7 text-amber-200" />
      </button>
      <img src="/conversations.svg" alt="image chat" className="w-[40%] md:w-[25%] lg:w-[15%] bg-[rgba(0,0,0,0.3)] rounded-full" />
      <p className="text-center">Welcome to PingPong Chat! Please select a contact to start chatting.</p>
    </div>
  );
}


function MainChat({ contact, showSidebar, setShowSidebar, reorderContacts, currentUserId, setContactsList, setSelectedChat, startCall, incomingCall, isCallActive, setUpdateMessage }: MainChatProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [messagesList, setMessagesList] = useState<Message[]>([]); // Initialize with imported messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [isClickedBlockIcon, setisClickedBlockIcon] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);


  // console.warn("=======>", contact);

  const { socket, onlineUsers } = useSocket(); // Assuming you have a useSocket hook to get the socket instance

  useEffect(() => {
    if (!contact) return;

    setSelectedChat((prevContact) => {
      if (!prevContact) return null;

      // Check the user's previous and current online status
      const wasOnline = contact.online;
      const isNowOnline = onlineUsers.includes(contact.id.toString());

      let newLastSeen = contact.lastSeen;

      // The key logic: update lastSeen ONLY when they go from online to offline
      if (wasOnline && !isNowOnline) {
        newLastSeen = new Date().getTime();
      }

      return {
        ...contact,
        online: isNowOnline,
        lastSeen: newLastSeen,
      };
    });
  }, [onlineUsers]);


  const playNotification = async () => {
    try {
      const audio = new Audio("/sounds/new-notification.mp3");

      // Set muted to false explicitly in case it's inherited
      audio.muted = false;

      await audio.play();
    } catch (error) {
      console.warn("Sound failed, falling back to vibration:", error);

      // Optional: trigger vibration if available
      if ("vibrate" in navigator) {
        navigator.vibrate(200); // vibrate for 200ms
      }
    }
  };

  useEffect(() => {
    if (!socket) return;

    // create object sound new message
    const handleIncomingMessage = (message: Message) => {
      if (contact == null) {
        return;
      }
      // Only push message if it's from the selected contact
      if (message.from == contact.id || message.to == contact.id) {
        // Play sound for new message
        playNotification();
        setMessagesList((prev) => [...prev, message]);
      }
    };

    const handleBlockUser = ({ userId, friendId }: { userId: number; friendId: number }) => {
      // alert("Block user event received for ID:" + userId + " friendId: " + friendId);
      if (!contact) return;

      // If current user is the one blocking
      if (currentUserId == userId && contact.id == friendId) {
        setSelectedChat((prev) => prev ? { ...prev, blocked: true, blockedBy: userId } : null);
        setContactsList((prev) =>
          prev.map((c) =>
            c.id == friendId ? { ...c, blocked: true, blockedBy: userId } : c
          )
        );
        setisClickedBlockIcon(false);
      }

      // If current user is the one being blocked
      else if (currentUserId == friendId && contact.id == userId) {
        setSelectedChat((prev) => prev ? { ...prev, blocked: true, blockedBy: userId } : null);
        setisClickedBlockIcon(false);
      }
    };


    const handleUnblockUser = ({ userId, friendId }: { userId: number; friendId: number }) => {
      // alert("Unblock user event received for ID:" + userId + " friendId: " + friendId);
      if (!contact) return;

      // 🔓 If current user unblocked someone
      if (currentUserId == userId && contact.id == friendId) {
        setSelectedChat((prev) => prev ? { ...prev, blocked: false, blockedBy: undefined } : null);
        setContactsList((prev) =>
          prev.map((c) =>
            c.id === friendId ? { ...c, blocked: false, blockedBy: undefined } : c
          )
        );
        setisClickedBlockIcon(false);
      }

      // If current user got unblocked by someone
      else if (currentUserId == friendId && contact.id == userId) {
        setSelectedChat((prev) => prev ? { ...prev, blocked: false, blockedBy: undefined } : null);
        setisClickedBlockIcon(false);
      }
    };


    const handleDeleteMessage = ({ messageId, from, userId }: { messageId: number; from: number, userId: number }) => {
      if (contact == null) return;
      // console.warn("Delete message event received for ID:", messageId , from ,userId , currentUserId);
      // Check if the message belongs to the current contact
      if ((contact.id == from || contact.id == userId)) {
        // alert("Deleting message with ID:" + messageId);
        // Filter out the deleted message from the messages list
        setMessagesList((prevMessages) => prevMessages.filter((msg) => msg.id != messageId));
      }
    }

    const handleUpdateMessage = ({ messageId, Updatemessage, from, userId }: { messageId: number; Updatemessage: string; from: number, userId: number }) => {
      if (contact == null) return;
      // console.warn("Update message event received for ID:", messageId, Updatemessage, from, userId);
      // alert("Updating message with ID:" + messageId + " to: " + Updatemessage);
      // Check if the message belongs to the current contact
      if ((contact.id == from || contact.id == userId)) {
        // Update the specific message in the messages list
        setMessagesList((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id == messageId ? { ...msg, message: Updatemessage } : msg
          )
        );
      }
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
      socket.off("deleteMessage", handleDeleteMessage);
      socket.off("editMessage", handleUpdateMessage);
    };
  }, [socket, contact?.id]);

  const handleSendMessage = async () => {
    try {
      if (contact == null) {
        return;
      }

      if (message) {
        // //console.log("Error exists, cannot send message.");
        return;
      }

      const messageToSend = inputValue.trim();
      if (isSending || !messageToSend) {
        return;
      }

      setIsSending(true); // Set sending state to true

      if (messageToSend) {
        // Send the message to the server
        const result = await fetchWithAuth(ApiRoutes.sendMessage, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: currentUserId,
            to: contact.id,
            message: messageToSend,
          }),
        });

        if (!result.ok) {
          const data = await result.json();
          // //console.error("Failed to send message:", data);
          setMessage("Failed to send message. Please try again.");
          return;
        }

        const data = await result.json();
        // //console.log("Fetched data successfully:", data);

        // Update the contact's last message
        setContactsList((prevContacts) => {
          return prevContacts.map((c) => {
            if (c.id === contact.id) {
              return {
                ...c,
                lastMessage: {
                  content: inputValue.trim(),
                  type: "text",
                },
              };
            }
            return c;
          });
        });

        setInputValue("");
        setUpdateMessage({ deleted: false, edited: false, id: -1 });
        reorderContacts(contact.id);
      }
    } catch (error) {
      // //console.error("Error sending message:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSending(false); // Always reset sending state
    }
  };

  // reset all when the contact changes
  useEffect(() => {
    setInputValue("");
    setMessage(""); // Reset error message
    setIsUploading(false); // Reset uploading state
    setLightboxImageUrl(null); // Reset lightbox image URL
    setisClickedBlockIcon(false); // Reset block icon state
    setIsSending(false); // Reset sending state
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  }, [contact]);

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesList, isUploading]);

  // fetch messages from the server when the component mounts
  useEffect(() => {
    // check if contact is null just return
    if (!contact) return;
    async function fetchData() {
      // //console.log("Fetching messages for contact:", currentUserId, contact?.id);
      try {
        const res = await fetchWithAuth(ApiRoutes.getMessages, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: currentUserId,
            to: contact?.id,
            limit: 20,
            offset: 0,
          }),
        });
        if (!res.ok) {
          // //console.error("Server responded with an error here here ");
          throw new Error('Server responded with an error');
        }
        const result = await res.json();
        // //console.log("Fetched messages:", result.messages);
        setMessagesList(result.messages.reverse());
      } catch (error) {
        //console.error(error);
      }
    }
    fetchData();
  }, [contact]);

  // send the file to the server and return the result
  // Note: This function is called when the user selects a file to upload
  async function sendFileToServer(file: File) {
    if (contact == null) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetchWithAuth(`${ApiRoutes.sendFile}/${currentUserId}/${contact.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const result = await response.json();
      // //console.log("File uploaded successfully:", result);
      return result;
    } catch (error) {
      // //console.error("Error uploading file:", error);
      setMessage("Failed to upload file or media not supported. Please try again.");
      return null; // Return null or handle the error as needed
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (contact == null) {
      return;
    }

    setMessage("");

    const file = event.target.files?.[0];
    if (!file) {
      return; // No file selected
    }

    setIsUploading(true);

    try {

      // check if audio file exceeds the size limit
      if (file.type.startsWith("audio/") && file.size > 10 * 1024 * 1024) {
        throw new Error("Audio file exceeds limit size. Please try again with a smaller file.");
      }

      // check if the file exceeds the size limit
      if (file.size > 100 * 1024 * 1024) {
        throw new Error("File exceeds limit size. Please try again with a smaller file.");
      }

      const fileData = await sendFileToServer(file);
      // alert("File uploaded successfully:" + JSON.stringify(fileData) + " " + fileData);

      if (!fileData) {
        throw new Error("File data could not be processed by the server.");
      }

      setContactsList((prevContacts) => {
        return prevContacts.map((c) => {
          if (c.id === contact.id) {
            return {
              ...c,
              lastMessage: {
                content: fileData.fileName || "File",
                type: fileData.type,
              },
            };
          }
          return c;
        });
      })

      reorderContacts(contact.id);

    } catch (error) {
      if (error instanceof Error) {
        //console.error("File handling failed:", error.message);
        setMessage(error.message);
      } else {
        //console.error("Unknown error during upload:", error);
        setMessage("An unknown error occurred during upload.");
      }
    } finally {
      setIsUploading(false); // Reset loading state
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ALWAYS reset the file input
      }
    }
  };

  // handle confirmation block for actions like blocking a user
  const handleBlockUser = async () => {
    if (contact == null) {
      return;
    }
    // Logic to block the user goes here
    // //console.log(`Blocking action from : ${currentUserId} -> ${contact.id}`);
    // Close the confirmation block after blocking
    try {
      const response = await fetchWithAuth(ApiRoutes.blockUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: currentUserId,
          to: contact.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to block user. Please try again.");
      }

      const data = await response.json();
      setSelectedChat((prevContact) => {
        if (!prevContact) return null;

        return {
          ...prevContact,
          blocked: data.blockUser || false, // Update the contact's blocked status
          blockedBy: data.blockedBy, // Update the contact's blockedBy status
        }
      });
      setContactsList((prevContacts) => {
        return prevContacts.map((c) => {
          if (c.id == contact.id) {
            return {
              ...c,
              blocked: data.blockUser || false, // Update the contact's blocked status
              blockedBy: data.blockedBy, // Update the contact's blockedBy status
            };
          }
          return c;
        });
      });

    } catch (error) {
      // //console.error("Error blocking user:", error);
      setMessage("Failed to block user. Please try again.");
    }
    setisClickedBlockIcon(false);
  };

  // handle unblocking a user
  const handleUnblockUser = async () => {
    if (contact == null) {
      return;
    }
    // Logic to unblock the user goes here
    // //console.log(`Unblocking user: ${contact.username}`);
    // Close the confirmation block after unblocking
    try {
      const response = await fetchWithAuth(ApiRoutes.unblockUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: currentUserId,
          to: contact.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to unblock user. Please try again.");
      }

      const data = await response.json();
      setUpdateMessage({ deleted: false, edited: false, id: -1 }); // Reset updateMessage state
      setSelectedChat((prevContact) => {

        if (!prevContact) return null;
        return {
          ...prevContact,
          blocked: data.unblockUser || false, // Update the contact's blocked status
          blockedBy: undefined, // Clear the blockedBy status
        }
      });
      setContactsList((prevContacts) => {
        return prevContacts.map((c) => {
          if (c.id == contact.id) {
            return {
              ...c,
              blocked: data.unblockUser || false, // Update the contact's blocked status
              blockedBy: undefined, // Clear the blockedBy status
            };
          }
          return c;
        });
      });
    } catch (error) {
      // //console.error("Error unblocking user:", error);
      setMessage("Failed to unblock user. Please try again.");
    }
    setisClickedBlockIcon(false);
  };

  const handleCancelBlock = () => {
    if (contact == null) {
      return;
    }
    // Logic to cancel the block action goes here
    // //console.log(`Cancelled blocking user: ${contact.username}`);
    // Close the confirmation block
    setisClickedBlockIcon(false);
  };

  return (
    <div className="m-0 p-0 z-10 flex-1  md:max-w-[100%] relative overflow-hidden
    bg-gray-800/40 backdrop-blur-md  shadow-xl border border-white/20 rounded-2xl
    ">
      <div className="h-full flex flex-col relative">
        {contact == null ? (<NoContactSelected setShowSidebar={setShowSidebar} />) : (<>

          <ImageLightbox
            imageUrl={lightboxImageUrl}
            onClose={() => setLightboxImageUrl(null)}
          />

          {/* Confirmation block for actions like blocking a user */}
          {isClickedBlockIcon && <ConfirmationBlock onCancel={handleCancelBlock} onConfirmBlock={handleBlockUser} onConfirmUnblock={handleUnblockUser} contact={contact} />}
          {/* Header with contact info and action buttons */}
          <HeaderContact contact={contact} setShowSidebar={setShowSidebar} showSidebar={showSidebar} isCallActive={isCallActive}
            incomingCall={incomingCall} startCall={startCall} currentUserId={currentUserId} setisClickedBlockIcon={setisClickedBlockIcon} setMessage={setMessage} />

          {/* Chat messages will go here */}
          <Messages messagesList={messagesList} messagesEndRef={messagesEndRef} setLightboxImageUrl={setLightboxImageUrl}
            message={message} setMessage={setMessage} isUploading={isUploading} contact={contact} currentUserId={currentUserId} setMessageList={setMessagesList} />

          {/* Placeholder for chat input */}
          {/* check if the user if blocked */}
          {contact?.blocked !== true ? (
            <ChatInput
              setMessage={setMessage}
              setInputValue={setInputValue}
              inputValue={inputValue}
              isUploading={isUploading}
              handleSendMessage={handleSendMessage}
              handleFileChange={handleFileChange}
              error={message}
              fileInputRef={fileInputRef}
              friendId={contact.id}
            />) : (
            <div className="bg-gray-800/100 backdrop-blur-md p-4 text-white rounded-b-2xl">
              <p className="text-[#FFB700] text-[12px] md:text-[16px] md:font-semibold text-center">
                {` You can't reply to this this conversation anymore!.`}
              </p>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

export default MainChat;

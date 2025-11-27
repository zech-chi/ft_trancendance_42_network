// this component will display the messages between two users
import React, { useEffect } from "react";
import { formatTimeTo_12h } from "@/app/protected/chat/utils/formatTimeTo_12h";
import { AudioPlayer } from "./AudioPlayer";
import LoaderSendingFile from "./LoaderSendingFile";
import { Contact, Message } from "@/app/protected/chat/types/typesChat";
import { FileBlock } from "./FileComponent";
import { ChevronDown, Trash2, Pencil } from "lucide-react";
import DeleteConfirmation from "./DeleteConfirmation";
import EditMessageForm from "./EditMessageForm";
import { ApiRoutes } from "@/app/protected/chat/utils/ApiRoutes";

type MessageCompProps = {
    currentUserId: number;
    contact: Contact | null
    messagesList: Message[];
    isUploading: boolean;
    setLightboxImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
    message?: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    setMessageList: React.Dispatch<React.SetStateAction<Message[]>>;
}

const getMaxWidthClass = (type: string) => {
    if (type === "audio") return "flex-1 max-w-[50%] md:max-w-[40%] 2xl:max-w-[25%]";
    if (type === "image") return "max-w-[70%] md:max-w-[30%] max-h-[40%]";
    return "max-w-[70%]";
};


function Messages({messagesList,messagesEndRef, setLightboxImageUrl, message, setMessage, isUploading, contact, currentUserId, setMessageList} : MessageCompProps) {

    // State to manage the visibility of options for each message
    const [showOptions, setShowOptions] = React.useState<number | null>(null);
    const [deletingMessageId, setDeletingMessageId] = React.useState<number | null>(null);
    const [editingMessage, setEditingMessage] = React.useState<Message | null>(null);
    const [offset, setOffset] = React.useState(20); // Start with the first 50 messages
    const [hasMoreMessages, setHasMoreMessages] = React.useState(true); // Assume there are more messages initially
    const messagesContainerRef = React.useRef<HTMLDivElement>(null); // Ref for the scrollable container
    // This function handles the deletion of a message
    const handleDeleteMessage = (messageId: number) => {
        setShowOptions(null); // Close the options menu
        setDeletingMessageId(messageId); // Set the ID to show the confirmation
    }

    // This is the function that will be called AFTER confirmation
    const confirmDelete = async () => {
      try {

      
      if (!deletingMessageId) return;
      console.log("Confirmed deletion for message ID:", deletingMessageId);
      
      // fetch request to delete the message
      const result = await fetch(`/api/chat/deletemsg/${deletingMessageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: currentUserId,
          to: contact?.id,
        }),
      });

      if (!result.ok) {
        console.error("Failed to delete message:", result.statusText);
        setMessage("Failed to delete message");
        return;
      }

      // If the deletion is successful, filter out the deleted message from the messagesList
      setMessageList((prevMessages) =>
        prevMessages.filter((msg) => msg.id != deletingMessageId)
      );

    } catch (error) {
      console.error("Error deleting message:", error);
      setMessage("Error deleting message");
    } finally {
      // Reset the state to hide the confirmation dialog
      setDeletingMessageId(null);
    }
  };

    // this function handles the update of a message
    const handleEditClick = (message: Message) => {
      setShowOptions(null); // Close options menu
      setEditingMessage(message); // Set the message to be edited
  };

  const handleCancelEdit = () => {
      setEditingMessage(null); // Clear the editing state
  };

  const handleSaveEdit = async (newText: string) => {
      if (!editingMessage) return;
      
      try {
          // // --- API Call to update the message ---
          const res = await fetch(`/api/chat/editmsg/${editingMessage.id}`, {
              method: 'POST', // Or PUT
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ from: currentUserId, to: contact?.id, message: newText }),
          });

          if (!res.ok) {
              throw new Error("Failed to update message");
          }

          const { time } = await res.json();
          console.log("Message updated successfully:", time);
          
          // --- Update Local State ---
          setMessageList(prev =>
              prev.map(m => (m.id === editingMessage.id ? { ...m, message: newText} : m))
          );

      } catch (error) {
          console.error("Error updating message:", error);
          setMessage("Failed to update message.");
      } finally {
          setEditingMessage(null); // Exit editing mode
      }
  };

    // useEffect if the user clicks on outside the message bubble, hide the options
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.received-bubble') && !target.closest('.sent-bubble')) {
                setShowOptions(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const fetchOlderMessages = async () => {
      if (!contact || !hasMoreMessages || !messagesContainerRef.current) return;
    
      const container = messagesContainerRef.current;
    
      // Save the current scroll position relative to the top
      const previousScrollHeight = container.scrollHeight;
      const previousScrollTop = container.scrollTop;
    
      try {
        console.log("Fetching older messages with offset:", offset);
    
        const res = await fetch(ApiRoutes.getMessages, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: currentUserId,
            to: contact.id,
            limit: 20,
            offset,
          }),
        });
    
        if (!res.ok) {
          console.error("Failed to fetch older messages:", res.statusText);
          setMessage("Failed to fetch older messages");
          return;
        }
    
        const result = await res.json();
        console.log("Fetched older messages:", result.messages);
    
        if (result.messages.length === 0) {
          setHasMoreMessages(false); // No more messages to fetch
        } else {
          const olderMessagesInCorrectOrder = result.messages.reverse(); // Reverse the order to maintain chronological order
          setMessageList((prevMessages) => [
            ...olderMessagesInCorrectOrder,
            ...prevMessages,
          ]); // Prepend older messages
          setOffset((prevOffset) => prevOffset + 20); // Update offset
    
          // Restore the scroll position after adding messages
          setTimeout(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
          }, 100); // Use a timeout to ensure the DOM updates before adjusting the scroll
        }
      } catch (error) {
        console.error("Error fetching older messages:", error);
        setMessage("Error fetching older messages");
      }
    };


    // reset the offset when the contact changes
    useEffect(() => {
      setOffset(20); // Reset offset to 50 when contact changes
      setHasMoreMessages(true); // Reset hasMoreMessages to true
    }, [contact]);

    useEffect(() => {
      const handleScroll = () => {
        if (!messagesContainerRef.current || !hasMoreMessages) return;
    
        // Check if the user has scrolled to the top
        if (messagesContainerRef.current.scrollTop === 0) {
          fetchOlderMessages(); // Fetch older messages
        }
      };
    
      const container = messagesContainerRef.current;
      container?.addEventListener("scroll", handleScroll);
    
      return () => {
        container?.removeEventListener("scroll", handleScroll);
      };
    }, [offset, hasMoreMessages, contact]);


  return (
    <div   ref={messagesContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 text-white max-h-[calc(100vh-200px)] border-l border-r border-white/20
          md:max-h-[calc(100vh-250px)] scrollbar relative  bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">

          {/* Error message display */}
          {message && (
            <div className="fixed bottom-2 left-[90%] -translate-x-1/2 w-[300px] h-[100px] text-white py-2 px-4 flex flex-col items-center justify-center
                          bg-gray-800/100 backdrop-blur-2xl p-6 shadow-xl border border-white/20 rounded-2xl
                          rounded-lg shadow-lg text-center z-50 animate-fade-in-up">
              <p className="text-gray-300">{message}</p>
              <button className="rounded-md mt-1 flex justify-end w-full">
                <span
                  className="text-white  cursor-pointer w-[30%] font-semibold border p-1 px-4 rounded-md
                  bg-[#1CBABA]/80 hover:bg-[#1CBABA] hover:w-[40%] hover:text-white transition-all duration-150"
                  onClick={() =>setMessage("")}
                >
                  ok
                </span>
              </button>
            </div>
          )}
          
          {/* check if there's no message between users */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {messagesList.length === 0 && (
              <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
            )}
          </div>
          {/* Placeholder for chat messages */}
          {messagesList.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sent ? "justify-end" : "justify-start"
              } mb-4`}
            >
              
            <div
               tabIndex={0}
                className={`group relative  p-2 rounded-lg ${getMaxWidthClass(message.type)} ${
                  message.sent
                    ? "bg-[#1CBABA]/70 text-white sent-bubble"
                    : "bg-[rgba(255,255,255,0.3)] text-white drop-shadow-lg received-bubble"
                } w-fit outline-none`}
              >

                 {/* --- RENDER THE CONFIRMATION DIALOG CONDITIONALLY --- */}
                 {deletingMessageId === message.id && (
                      <DeleteConfirmation
                        messageType={message.type}
                        onConfirm={confirmDelete}
                        onCancel={() => setDeletingMessageId(null)} // Simply hide on cancel
                        />
                  )}
                {/* Render the edit form if the message is being edited */}
                  {editingMessage && editingMessage.id === message.id && (
                            <EditMessageForm
                                initialText={editingMessage.message || ''}
                                onSave={handleSaveEdit}
                                onCancel={handleCancelEdit}
                            />
                    )}

                <div className={`absolute right-0 top-0 backdrop-blur-2xl rounded-full cursor-pointer hidden 
                   ${message.sent ? "group-hover:block group-focus-within:block transition-all duration-200" : ""} `}>
                    <ChevronDown onClick={() => {
                        if (message.sent) {
                          setShowOptions((prev) => ((prev === message.id  ? null : message.id)));
                        }
                    }}
                    size={23} 
                    className={`${message.sent ? "text-white" : "text-yellow-400"}`}/>
                </div>

                {/* options */}
                { message.id == showOptions && 
                <div className={`absolute overflow-hidden z-10 ${message.sent ? "-left-25" : "-right-25"} top-[-10px] flex flex-col gap-0.5 bg-gray-800/100 border border-white/20 rounded-md transition-all duration-200`}>
                    <button onClick={() => handleDeleteMessage(message.id)} className={`text-[#FFB700] px-2 py-0.5 flex flex-row items-center gap-2 cursor-pointer hover:bg-gray-900 ${message.type == "text" ? "" : "py-2"}`}>
                        <Trash2 size={16} className="" />
                         <p>Delete</p>
                    </button>
                    { message.type == "text" && 
                      <button onClick={() => handleEditClick(message) }  className="text-[#1CBABA] px-2 py-0.5 flex flex-row gap-2 items-center  cursor-pointer hover:bg-gray-900">
                          <Pencil size={16} className="" />
                          <p>Edit</p>
                      </button>
                    }
                </div>}

                {/* Render Image Type */}
                {message.type === "image" && message.url && (
                  <img
                    src={message.url}
                    alt="image chat"
                    className="rounded-md cursor-pointer"
                    onLoad={() => {
                      // Scroll to the bottom when an image is loaded
                      if (messagesEndRef.current) {
                        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                      }
                    }}

                    onClick={() => setLightboxImageUrl(message.url!)} // Open lightbox on click
                  />
                )}

                {/* Render File Type */}
                {message.type === "file" && message.url && message.fileName && (
                  <FileBlock
                    url={message.url}
                    fileName={message.fileName}
                    thumbnailUrl={message.thumbnailUrl} // Optional thumbnail URL
                    // pass the messageEndRef to scroll to the bottom after file is sent
                    messageEndRef={messagesEndRef}
                  />
                )}

                {/* Render Audio Type */}
                {message.type === "audio" && (
                  // <audio
                  //   controls
                  //   className=" mt-2 bg-[rgba(0,0,0,0.5)] rounded-full w-[150px] md:w-[285px]"
                  //   src={message.url}
                  //   onLoadedMetadata={() => {
                  //     // Scroll to the bottom when audio is loaded
                  //     if (messagesEndRef.current) {
                  //       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                  //     }
                  //   }}
                  // >
                  //   Your browser does not support the audio element.
                  // </audio>
                  <AudioPlayer
                    url={message.url || ''}
                    id={message.id}
                    sentbyMe={message.sent}
                    onReady={() => {
                      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                )}

                {/* Render Text Type */}

                {message.type === "text" && (
                  <p className=" text-[13px] md:text-xs font-semibold break-words whitespace-pre-wrap">
                    {message.message}
                  </p>
                )}
                <span
                  className={`text-[10px] block mt-0.5 ${
                    message.sent ? "text-shadow-gray-50" : "text-gray-400"
                  }`}
                >
                  {formatTimeTo_12h(message.time)}
                </span>
              </div>
            </div>
          ))}

          {/* Scroll to the bottom of the chat when new messages are added */}
          <div ref={messagesEndRef} className="text-black flex justify-end">
            {isUploading && <LoaderSendingFile />} {/* Show loader when uploading */}
          </div>
        </div>
  )
}

export default Messages
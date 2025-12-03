// chat page
"use client";

// import contacts && messages from the store
import { useEffect, useState } from "react";
// import { contacts } from "../../data/data";
import ListFriends from "./components/ListFriends";
import MainChat from "./components/MainChat";
import { Contact, UpdateMessage } from "@/app/gzone/chat/types/typesChat";
import { useUser } from './context/UserContext';
import { useSocket } from "./context/SocketContext";
import { useCall } from "@/app/gzone/chat/hooks/useCall";
import { IncomingCall } from "./components/IncomingCall";
import { CallView } from "./components/CallView";
import { ApiRoutes } from "@/app/gzone/chat/utils/ApiRoutes";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { fetchUser } from "@/app/(auth)/login/page";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

function Chat() {



    const { loggedUserName, setLoggedUserName } = useLoggedUserName();
    const { loggedUserId: userId , setLoggedUserId } = useLoggedUserId();
    const { selectedUserName, setSelectedUserName } = useSelectedUserName();
    // const [loading, setLoading] = useState(true);
    const router = useRouter();
        
    // alert the userid 
    // alert(`Current User ID: ${userId} ${loggedUserName}`);
    

//   const { userId } = useUser() as { userId: number | null };
   console.log("selected user name in chat page: ", selectedUserName);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<Contact | null>(null);
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [callPartner, setCallPartner] = useState<Contact | null>(null);
  const [updateMessage, setUpdateMessage] = useState<UpdateMessage>({ deleted: false, edited: false, id: -1});
  const {onlineUsers} = useSocket();
  const {
    localStream,
    remoteStream,
    isCallActive,
    incomingCall,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    type,
    isCallStarted,
  } = useCall(userId, loggedUserName ? loggedUserName : "");



//   useEffect(() => {
//     async function checkAuth() {
//         const user = await fetchUser();
//         console.log("Fetched user:", user);
//         if (!user || !user.userName) {
//             setLoggedUserName(null);
//             setLoggedUserId(0);
//             router.push("/login");
//         } else {
//             setLoggedUserName(user.userName);
//             setLoggedUserId(user.id);
//         }
//         setLoading(false);
//       }
//       checkAuth();
// }, []);
        
       
  
  useEffect(() => {
    setContactsList(prevContacts => 
      prevContacts.map(contact => {
        
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

      })
    );
  }, [onlineUsers]); // The dependency array is key!

  useEffect(() => {
    // If a call is active, we need to figure out who we're talking to.
    if (isCallActive) {
      // Scenario 1: We just answered an incoming call.
      // The `incomingCall` object is our source of truth.
      if (incomingCall && !isCallStarted) {
        const partner = contactsList.find(c => c.id.toString() === incomingCall.from);
        if (partner) {
          setCallPartner(partner);
          return; // Exit early, we found our partner.
        }
      }
      
      // Scenario 2: We started the call ourselves.
      // In this case, the currently selected chat MUST be our partner.
      if (selectedChat) {
        setCallPartner(selectedChat);
      }
    } else {
      // If the call is not active, clear the partner.
      setCallPartner(null);
    }
  }, [isCallActive, incomingCall, selectedChat, contactsList]);


  // fetch the friends from the database
  useEffect(() => {
    if (!userId) return;
    const fetchContacts = async () => {
      try {
        const response = await fetchWithAuth(`${ApiRoutes.ListFriends}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }), // replace with actual user ID
        });
  
        const data = await response.json();
        console.log("Fetched contacts:", data);
        if (data.status === "ok") {
          setContactsList(data.friends);
        } else {
          console.error("Failed to fetch contacts:", data);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
      console.log("Contacts list after fetch attempt:");
    };
  
    fetchContacts();
  }, [userId]);

  useEffect(() => {
    if (!contactsList.length || !selectedUserName) return;
    const selected = contactsList.find(c => c.username === selectedUserName);
    if (selected) setSelectedChat(selected);
  }, [contactsList, selectedUserName]);


  // to remove 
  if (!userId || (userId < 0 )) return <div>Loading user...</div>;
  console.log("currrent user ID: ", userId);
  // end remove

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

   const displayedContacts = searchQuery
    ? contactsList.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contactsList;

  const reorderContacts = (contactId: number) => {
    setContactsList((prevContacts) => {
      const contactToMove = prevContacts.find((c) => c.id === contactId);
      if (!contactToMove) return prevContacts; // Should not happen

      const otherContacts = prevContacts.filter((c) => c.id !== contactId);
      return [contactToMove, ...otherContacts];
    });
  };

  //  if (loading) {
  //           return (
  //               <div className="h-screen flex items-center justify-center text-white">
  //                   Loading... 2
  //               </div>
  //           );
  //       }

  return (

            <>
                    {/* update here was added w-full may can make some issues !!!!! */}
                    <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto overflow-y-hidden"> 
                        <Sidebar />
                        <Navbar />
                        <main className="flex flex-row items-center justify-center relative overflow-x-hidden
                            xl:pl-20 2xl:pl-24 w-full
                            h-[calc(100vh-130px)]
                            xl:h-[calc(100vh-75px)]
                            2xl:h-[calc(100vh-85px)]
                            2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden
                        ">
        {/* h-[calc(100vh-60px)] */}
      {/* <div className="w-full h-[90vh]"> */}
      <div className="flex items-center justify-center h-full p-2 py-0 w-full">
        {/* i should change the max-h because i add it for the textearea input message */}
        <div className="relative w-full 
        md:w-[90%] h-full overflow-hidden rounded-2xl 
        flex flex-row gap-2 p-4 flex-1
        bg-gray/10  rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]  border border-white/30
        ">
          {/* background layers */}
          <div className="absolute inset-0"></div>
          <div className="absolute inset-0"></div>

           {/* --- Render Call-Related UI Conditionally --- */}
        {incomingCall && !isCallActive && (
          <IncomingCall
            call={incomingCall}
            onAccept={answerCall}
            onReject={rejectCall}
          />
        )}
        
        {isCallActive && callPartner && (
          <CallView
            localStream={localStream}
            remoteStream={remoteStream}
            onEndCall={endCall}
            contactName={callPartner.name}
            type={type} // Pass the call type (audio/video)
            avatar={callPartner.avatar} // Pass the contact's profile URL
            isCallStarted={isCallStarted} // Pass the call active state
          />
        )}

          {showSidebar && (
            <div
              className="fixed inset-0 bg-black/60 z-12 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* <AudioPlayerProvider> */}

          {/* content wrapper */}
          <ListFriends
            contactsList={displayedContacts}
            setContactsList={setContactsList}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchChange={handleSearchChange}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            reorderContacts={reorderContacts}
            updateMessage={updateMessage}
            setUpdateMessage={setUpdateMessage}
          />

          {/* main chat area */}
          <MainChat
            contact={selectedChat}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            reorderContacts={reorderContacts}
            setContactsList={setContactsList}
            setSelectedChat={setSelectedChat}
            startCall={startCall}
            incomingCall={incomingCall}
            isCallActive={isCallActive}
            setUpdateMessage={setUpdateMessage}
            // to remove
            currentUserId={userId}
            // end remove
          />
          {/* </AudioPlayerProvider> */}
        </div>
      </div>
    {/* </div> */}
        
    
                        </main>
                    </div>
                </>
  );
}

export default Chat;

// this component is used to display the contact information in the header
"use client"

import React from "react"
import { Contact } from "@/app/protected/chat/types/typesChat"
import { ArrowLeft, Phone, Video } from "lucide-react"
import UserStatus from "./UserStatus"
import { RiUserForbidFill } from "react-icons/ri"
import { formatLengthNameUser } from "@/app/protected/chat/utils/formatLengthNameUser"
import { IncomingCall } from "@/app/protected/chat/types/typesChat"
import { useSelectedUserName } from "@/context/SelectedUserNameContext";
import { useRouter } from "next/navigation";

type HeaderContactProps = {
    contact: Contact,
    setShowSidebar: (show: boolean) => void,
    showSidebar: boolean,
    isCallActive: boolean,
    incomingCall: IncomingCall | null,
    startCall: (contactId: number, callType: 'video' | 'audio') => void,
    currentUserId: number,
    setisClickedBlockIcon: (clicked: boolean) => void
    setMessage: React.Dispatch<React.SetStateAction<string>>
}


export default function HeaderContact({contact, setShowSidebar, showSidebar, isCallActive, 
    incomingCall, startCall, currentUserId, setisClickedBlockIcon, setMessage}: HeaderContactProps) {

      const { setSelectedUserName } = useSelectedUserName();
      const router = useRouter();

      const handleClickPhoneCall = () => {
        if (contact?.blocked) {
          setMessage(`You can't call ${contact?.name} this conversation is blocked.`);
          return;
        }
        startCall(contact?.id, 'audio');
      }

      const handleClickVideoCall = () => {
        if (contact?.blocked) {
          setMessage(`You can't call ${contact?.name} this conversation is blocked.`);
          return;
        }
        startCall(contact.id, 'video');
      }

  return (
    <div className="bg-[rgba(0,0,0,0.3)] rounded-t-[50px] flex justify-between">
          <div className="flex items-center p-2 gap-0.5 md:gap-2 md:p-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white lg:hidden"
            >
              <ArrowLeft className="w-7 h-7 text-amber-200" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={contact?.avatar}
                alt={contact?.name}
                className="w-12 h-12 md:w-18 md:h-18 rounded-full"
              />
              <div>
                <h2 className="text-white text-sm md:text-[18px] font-semibold">{formatLengthNameUser(contact?.name)}</h2>
                {/* // ! to talk with team, if it should stay or not */}
                <button className="hidden md:block text-sm text-amber-100 font-bold hover:underline hover:cursor-pointer"
                  onClick={() => {
                    setSelectedUserName(contact?.username);
                    router.push(`/protected`);
                  }}
                >
                  @{contact?.username}
                </button>
                <UserStatus user={contact} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 mr-0 md:mr-6">
            {/* phone call block icons */}
            <div className="flex items-center gap-3 md:gap-8">
              <button
                className="text-white hover:text-amber-200"
                onClick={handleClickVideoCall}
                disabled={isCallActive || !!incomingCall}
              >
                <Video className="w-5 h-5 md:w-9 md:h-9" />
              </button>

              <button className="text-white hover:text-amber-200" 
                onClick={handleClickPhoneCall}
                disabled={isCallActive || !!incomingCall}>
                <Phone className="w-5 h-5 md:w-8 md:h-8" />
              </button>

              <button className={`text-white hover:text-amber-200 ${contact?.blocked && contact?.blockedBy != currentUserId ? "hidden" : ""}`}>
                <RiUserForbidFill
                  className={`w-5 h-5 md:w-8 md:h-8 ${contact?.blocked ? "text-green-500" : "text-red-500"}`}
                  onClick={() => setisClickedBlockIcon(true)} // Open confirmation block
                  title={`${contact?.blocked ? "unblock" : "block"} ${contact?.username}`}
                />
                {/* <img src="/block.png" alt="blockIcon" className="w-5 h-5 md:w-9 md:h-9" /> */}
              </button>
            </div>
          </div>
    </div>
  );
}
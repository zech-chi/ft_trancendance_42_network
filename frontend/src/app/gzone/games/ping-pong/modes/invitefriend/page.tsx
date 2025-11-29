"use client";


import Sidebar from "@/components/layout/Sidebar";
import InviteToPlay from "../../components/InviteFriendtoPlay";
import Navbar from "@/components/layout/Navbar";
// import BasicModal from "../components/Modale";

export default function Test() {
  return (
    <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
        <Sidebar />
        <Navbar />
        <main
          className="flex flex-row items-center justify-center relative overflow-x-hidden
                            xl:pl-20 2xl:pl-24 w-full
                            h-[calc(100%-130px)]
                            xl:h-[calc(100%-75px)]
                            2xl:h-[calc(100%-85px)]
                            2xl:mt-[67px] xl:mt-[60px] overflow-y-hidden
                        "
        >
        <div className="flex h-screen w-screen bg-cover bg-center overflow-auto justify-center">
          <InviteToPlay />
        </div>
        </main>
</div>
  );
}




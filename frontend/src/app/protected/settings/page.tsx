"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

type PropsProfileImage = {
  imgSrc: string;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

// profile image component
function ProfileImage({ imgSrc, handleImageUpload }: PropsProfileImage) {
  return (
    <div className="flex items-center justify-center mt-20 bg-green-200">
        <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-full border-2 border-black flex items-center justify-center relative">
          <img
            src={imgSrc}
            alt="Profile"
            className="w-full h-full object-cover object-center rounded-full"
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            id="profile-upload"
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Camera Icon Overlay */}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-[-20px] right-1 rounded-full p-2 cursor-pointer shadow-md"
          >
            <img
              src="/camera.png" // <-- Use camera icon file
              alt="Upload"
              className="w-12 h-12 hover:scale-120 transition-transform duration-200"
            />
          </label>
        </div>
    </div>
  )
}

// profile info 
function ProfileInfo() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 px-4 md:px-[50px] mt-20 bg-green-200">
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor="f-name"
            className="mb-1 text-white text-sm md:text-base font-bold"
          >
            First Name
          </label>
          <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

            <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

            <input
              type="text"
              id="f-name"
              placeholder="Enter your nickname"
              className="relative z-10 w-full h-full p-4 text-yellow-200 font-semibold placeholder:text-yellow-100 text-center  border border-yellow-500/30
                  rounded-[20px] bg-transparent
                  focus:outline-none focus:border-yellow-500 focus:border-2
                  bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <label
            htmlFor="l-name"
            className="mb-1 text-white text-sm md:text-base font-bold"
          >
            Last Name
          </label>
          <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

            <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

            <input
              type="text"
              id="l-name"
              placeholder="Enter your nickname"
              className="relative z-10 w-full h-full p-4 text-yellow-200 font-semibold placeholder:text-yellow-100 text-center border border-yellow-500/30
                  rounded-[20px] bg-transparent
                  focus:outline-none focus:border-yellow-500 focus:border-2
                  bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <label
            htmlFor="nickname"
            className="mb-1 text-white text-sm md:text-base font-bold"
          >
            Nickname
          </label>

          <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

            <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

            <input
              type="text"
              id="nickname"
              placeholder="Enter your nickname"
              className="relative z-10 w-full h-full p-4 text-yellow-200 font-semibold placeholder:text-yellow-100 text-center border border-yellow-500/30
                  rounded-[20px] bg-transparent
                  focus:outline-none focus:border-yellow-500 focus:border-2
                  bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
            />
          </div>
        </div>
    </div>
  )
}


type PropsProfilePasswords = {
  showOldPassword: boolean;
  setShowOldPassword: (value: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
};


// profile passwords
function ProfilePasswords({showOldPassword, setShowOldPassword, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword}: PropsProfilePasswords) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 px-4 md:px-[50px] mt-20 bg-green-200">
      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="o-password"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          Old Password
        </label>
        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

          <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

          <input
            id="o-password"
            type={showOldPassword ? "text" : "password"}
            placeholder="Enter your nickname"
            className="relative z-10 w-full h-full p-4 pr-[40px] text-yellow-200 font-semibold placeholder:text-yellow-100 text-center border border-yellow-500/30
                rounded-[20px] bg-transparent
                focus:outline-none focus:border-yellow-500 focus:border-2
                bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
          />

          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-200 z-10"
          >
            {showOldPassword ? (
              <Eye className="w-5 h-5  md:w-6 md:h-6" />
            ) : (
              <EyeOff className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="n-password"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          New Password
        </label>
        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

          <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

          <input
            type={showNewPassword ? "text" : "password"}
            id="n-password"
            placeholder="Enter your nickname"
            className="relative z-10 w-full h-full p-4 pr-[40px] text-yellow-200 font-semibold placeholder:text-yellow-100 text-center border border-yellow-500/30
                rounded-[20px] bg-transparent
                focus:outline-none focus:border-yellow-500 focus:border-2
                bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-200 z-10"
          >
            {showNewPassword ? (
              <Eye className="w-5 h-5  md:w-6 md:h-6" />
            ) : (
              <EyeOff className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="c-password"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          Confirm Password
        </label>

        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

          <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

          <input
            type={showConfirmPassword ? "text" : "password"}
            id="c-password"
            placeholder="Enter your nickname"
            className="relative z-10 w-full h-full p-4 pr-[40px] text-yellow-200 font-semibold placeholder:text-yellow-100 text-center border border-yellow-500/30
                rounded-[20px] bg-transparent
                focus:outline-none focus:border-yellow-500 focus:border-2
                bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-200 z-10"
          >
            {showConfirmPassword ? (
              <Eye className="w-5 h-5  md:w-6 md:h-6" />
            ) : (
              <EyeOff className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

type PropsProfileBio = {
  bioText: string;
  setBioText: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

// profile bio
function ProfileBio({bioText, setBioText, textareaRef}: PropsProfileBio) {
  return (
    <div className="flex items-center justify-center px-4 md:px-[9%] mt-20 bg-green-200">
        <div className="flex flex-col items-center w-full max-w-[400px] md:max-w-[100%]">
          <label
            htmlFor="bio"
            className="mb-1 text-white text-sm md:text-base font-bold"
          >
            Bio
          </label>
          <div className="relative w-full rounded-[20px] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>
            <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
            <textarea
              ref={textareaRef} // ATTACH the ref to the textarea
              id="bio"
              maxLength={150}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              rows={1}
              className="relative w-full h-full max-h-[200px] p-4  text-yellow-200 font-semibold placeholder:text-yellow-100 text-center border border-yellow-500/30
          rounded-[20px] bg-transparent 
          focus:outline-none focus:border-yellow-500 focus:border-2
          bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent
          scrollbar"
            />
          </div>
          <div className="text-xs text-right mt-1 text-amber-200/70 self-end">
            {bioText.length}/150 characters max
          </div>
        </div>
    </div>
  )
}

// profile language & email
function ProfileLanguageEmail() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2 px-4 md:px-[50px] mt-20 bg-green-200">
    <div className="flex flex-col items-center w-full">
      <label
        htmlFor="language"
        className="mb-1 text-white text-sm md:text-base font-bold"
      >
        Language
      </label>
      <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden border border-yellow-500/30">
        <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

        <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

        <div className="relative">
          <select
            id="language"
            defaultValue="English"
            className="w-full appearance-none bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent text-yellow-200
           font-bold px-4 py-4 text-center focus:outline-none focus:border-amber-500"
           onChange={(e) => {
              alert("Selected language:" + e.target.value);
           }
          }
          >
            <option
              className="bg-[rgba(0,0,0,0.8)] text-white"
              value="English"
            >
              English
            </option>
            <option
              className="bg-[rgba(0,0,0,0.8)] text-white"
              value="French"
            >
              French
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
            <ChevronDown className="h-6 w-6  md:w-8 md:h-8" />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col items-center w-full">
      <label
        htmlFor="email"
        className="mb-1 text-white text-sm md:text-base font-bold"
      >
        Email
      </label>
      <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

        <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="relative z-10 w-full h-full p-4 text-yellow-200 font-semibold placeholder:text-yellow-100 text-center border border-yellow-500/30
             rounded-[20px] bg-transparent text-sm md:text-base
             focus:outline-none focus:border-yellow-500 focus:border-2
             bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
        />
      </div>
    </div>
  </div>
  )
}


// profile savings
function ProfileSavings() {
  return (
    <div className="flex justify-center mt-20 bg-green-400">
      <div className="relative flex justify-center w-full max-w-[140px] h-[56px] rounded-[20px] overflow-hidden border border-yellow-500/30 hover:border-2 hover:border-yellow-500">
        <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div>

        <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
        <button
          type="button"
          onClick={() => {
            alert("data should be send it to backend")
            console.log("data should be send it to backend")
            }
          }
          className="bg-transparent w-full h-full text-yellow-200 hover:bg-amber-900/30 rounded[20px] font-bold
          px-12 py-2 transition-all z-10 bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
        >
          Save
        </button>
      </div>
    </div>
  )
}



function Settings() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bioText, setBioText] = useState("One heartbeat matters, the next one");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imgSrc, setImgSrc] = useState("/zechi.jpg"); // Default profile image

  // load the image from local storage if it exists
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered ------>", event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image loaded successfully ------>", reader.result);
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // This effect will run whenever bioText changes
  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      // console.log(el, el.scrollHeight);
      el.style.height = "auto"; // Reset height to shrink if needed
      el.style.height = `${el.scrollHeight}px`; // Set height to content height
    }
  }, [bioText]);

  return (
    <>
      {/* update here was added w-full may can make some issues !!!!! */}
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
          <div className="flex items-center justify-center h-[90vh] p-4 w-full flex-1">
            <div className="relative w-full md:w-[85%] h-[100%] overflow-hidden rounded-[50px] flex items-center justify-center p-4 max-h-[1200px] flex-1">
              {/* background layers */}
              <div className="absolute inset-0 settings-bg bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-[rgba(9,0,0,0.5)]"></div>

              {/* content wrapper */}
              <div className="relative z-10 w-full w[90%] h-[100%] rounded-[50px] bg-[rgba(0,0,0,0.4)] overflow-hidden  text-white pt-6 md:p-4">
                <div className="h-full overflow-y-auto scrollbar">
                  {/* profile image section */}
                  <ProfileImage imgSrc={imgSrc} handleImageUpload={handleImageUpload} />
                  {/* form inputs */}
                  <ProfileInfo />

                  {/* form passowrd */}
                  <ProfilePasswords 
                    showOldPassword={showOldPassword} 
                    setShowOldPassword={setShowOldPassword}
                    showNewPassword={showNewPassword} 
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword} 
                    setShowConfirmPassword={setShowConfirmPassword}
                  />

                  {/* form bio */}
                  <ProfileBio 
                    bioText={bioText} 
                    setBioText={setBioText} 
                    textareaRef={textareaRef}
                  />

                  {/* language & email */}
                  <ProfileLanguageEmail />

                  {/* save button */}
                  <ProfileSavings />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Settings;

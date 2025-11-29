"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { X, Check } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import TwoFASetup from "./components/TwoFASetup";
import { useLoggedUserId } from "@/context/UserIdContext";
import Image from "next/image";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

type PropsProfileImage = {
  imgSrc: string;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

// profile image component
function ProfileImage({ imgSrc, handleImageUpload }: PropsProfileImage) {
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-full border-2 border-[#1CBABA]/75 flex items-center justify-center relative">
        {/* <img
          src={imgSrc}
          alt="Profile"
          className="w-full h-full object-cover object-center rounded-full"
        /> */}
        <Image
          src={imgSrc}
          alt="Profile"
          fill
          className="object-cover object-center rounded-full"
          sizes="100vw"
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
  );
}

// props for profile info
interface PropsProfileInfo {
  fullName: string;
  setFullName: (value: string) => void;
  userName: string;
  is2FAEnabled: boolean;
  setIs2FAEnabled: (value: boolean) => void;
}

// profile info
function ProfileInfo({
  fullName,
  setFullName,
  userName,
  is2FAEnabled,
  setIs2FAEnabled,
}: PropsProfileInfo) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 px-4 md:px-[50px] mt-20">
      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="f-name"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          {/* full name */}
          Full Name
        </label>
        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">

          <input
            type="text"
            id="f-name"
            placeholder="Your Full Name"
            className="relative z-10 w-full h-full p-4 text-[#1CBABA] font-semibold placeholder:text-yellow-100 text-center  border border-white/30
                  rounded-[20px] bg-transparent
                  focus:outline-none focus:border-[#1CBABA] focus:border-2
                  bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="nickname"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          {/*User name */}
          User Name
        </label>

        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">

          <input
            type="text"
            id="nickname"
            placeholder="Your Username"
            className="relative z-10 w-full h-full p-4 text-[#1CBABA] font-semibold placeholder:text-yellow-100 text-center border border-white/30
                  rounded-[20px] bg-transparent
                  focus:outline-none focus:border-[#1CBABA] focus:border-2
                  bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent hover:cursor-not-allowed"
            value={userName}
            // onChange={(e) => setUserName(e.target.value)}
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <span className="mb-1 text-white font-bold text-sm md:text-base">
          Two-factor authentication (2fa)
        </span>

        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
          {/* visible layer */}
          <div
            className="relative z-10 w-full h-full flex items-center justify-center gap-5 border border-white/30
        rounded-[20px] bg-transparent bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent
        focus-within:border-[#1CBABA] focus-within:border-2"
          >
            <button
              onClick={() => setIs2FAEnabled(!is2FAEnabled)}
              className={`relative w-14 h-7 cursor-pointer flex items-center rounded-full transition-colors duration-300 ${is2FAEnabled ? "bg-[#1CBABA]" : "bg-gray-500"
                }`}
            >
              <span
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${is2FAEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
              />
            </button>

            {/* <span
              className={`font-bold ${
                is2FAEnabled ? "text-green-400" : "text-red-400"
              }`}
            >
              {is2FAEnabled ? "ON" : "OFF"}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

type PropsProfilePasswords = {
  showOldPassword: boolean;
  setShowOldPassword: (value: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  oldPassword: string;
  setOldPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
};

// profile passwords
function ProfilePasswords({
  showOldPassword,
  setShowOldPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}: PropsProfilePasswords) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 px-4 md:px-[50px] mt-20">
      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="o-password"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          Current Password
        </label>
        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden">
          {/* <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div> */}

          {/* <div className="absolute inset-0 bg-black opacity-20 z-0"></div> */}

          <input
            id="o-password"
            type={showOldPassword ? "text" : "password"}
            placeholder="Enter your current password"
            className="relative z-10 w-full h-full p-4 pr-[40px] text-[#1CBABA] font-semibold placeholder:text-[#1CBABA]/75 text-center border border-white/30
                rounded-[20px] bg-transparent
                focus:outline-none focus:border-[#1CBABA] focus:border-2
                bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1CBABA] z-10 cursor-pointer"
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
          {/* <div className="absolute inset-0 bg-[url('/bgImg.jpg')] bg-cover bg-center opacity-80 z-0"></div> */}

          {/* <div className="absolute inset-0 bg-black opacity-20 z-0"></div> */}

          <input
            type={showNewPassword ? "text" : "password"}
            id="n-password"
            placeholder="Enter your new password"
            className="relative z-10 w-full h-full p-4 pr-[40px] text-[#1CBABA] font-semibold placeholder:text-[#1CBABA]/75 text-center border border-white/30
                rounded-[20px] bg-transparent
                focus:outline-none focus:border-[#1CBABA] focus:border-2
                bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1CBABA] z-10 cursor-pointer"
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

          <input
            type={showConfirmPassword ? "text" : "password"}
            id="c-password"
            placeholder="Confirm your new password"
            className="relative z-10 w-full h-full p-4 pr-[40px] text-[#1CBABA] font-semibold placeholder:text-[#1CBABA]/75 text-center border border-white/30
                rounded-[20px] bg-transparent
                focus:outline-none focus:border-[#1CBABA] focus:border-2
                bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1CBABA] z-10 cursor-pointer"
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
  );
}

type PropsProfileBio = {
  bioText: string;
  setBioText: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

// profile bio
function ProfileBio({ bioText, setBioText, textareaRef }: PropsProfileBio) {
  return (
    <div className="flex items-center justify-center px-4 md:px-[9%] mt-20">
      <div className="flex flex-col items-center w-full max-w-[400px] md:max-w-[100%]">
        <label
          htmlFor="bio"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          Bio
        </label>
        <div className="relative w-full rounded-[20px] overflow-hidden flex items-center justify-center">
          <textarea
            ref={textareaRef} // ATTACH the ref to the textarea
            id="bio"
            maxLength={150}
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            rows={1}
            className="relative w-full h-full max-h-[200px] p-4  text-[#1CBABA] font-semibold placeholder:text-yellow-100 text-center border border-white/30
          rounded-[20px] bg-transparent 
          focus:outline-none focus:border-[#1CBABA] focus:border-2
          bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent
          scrollbar"
          />
        </div>
        <div className="text-xs text-right mt-1 text-[#1CBABA]/80 self-end">
          {bioText.length}/150 characters max
        </div>
      </div>
    </div>
  );
}

// props for profile language & email
interface PropsProfileLanguageEmail {
  email: string;
  // setEmail: (value: string) => void;
}

// profile language & email
function ProfileLanguageEmail({ email }: PropsProfileLanguageEmail) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2 px-4 md:px-[50px] mt-20">
      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="language"
          className="mb-1 text-white text-sm md:text-base font-bold"
        >
          Language
        </label>
        <div className="relative w-full max-w-[400px] h-[56px] rounded-[20px] overflow-hidden border border-white/30">

          <div className="relative">
            {/* to change later the default value to current languges */}
            <select
              id="language"
              defaultValue="Select Language"
              className="w-full appearance-none bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent text-[#1CBABA]
           font-bold px-4 py-4 text-center focus:outline-none focus:border-amber-500"
              onChange={(e) => {
                alert("Selected language:" + e.target.value);
              }}
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1CBABA]">
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
          <input
            type="email"
            id="email"
            placeholder="Your email"
            className="relative z-10 w-full h-full p-4 text-[#1CBABA] font-semibold placeholder:text-yellow-100 text-center border border-white/30
             rounded-[20px] bg-transparent text-sm md:text-base
             focus:outline-none focus:border-[#1CBABA] focus:border-2
             bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent hover:cursor-not-allowed"
            value={email}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

// props for handle save button
type PropsProfileSavings = {
  handleSave: () => Promise<void>;
};

// profile savings
function ProfileSavings({ handleSave }: PropsProfileSavings) {
  return (
    <div className="flex justify-center mt-20">
      <div className="relative flex justify-center w-full max-w-[140px] h-[56px] rounded-[20px] overflow-hidden border border-white/30 hover:border-2 hover:border-[#1CBABA]
      bg-transparent bg-gradient-to-r from-[rgba(0,0,0,0.8)] to-transparent
      ">
        <button
          type="button"
          onClick={handleSave}
          className="bg-transparent w-full h-full text-[#1CBABA] rounded[20px] font-bold cursor-pointer
          px-12 py-2 transition-all z-10"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// type PopupProps = {
//   message: string;
//   type: "success" | "error";
//   onClose: () => void;
// };

// function Popup({ message, type, onClose }: PopupProps) {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div
//         className={`px-6 py-4 rounded-lg shadow-lg text-white font-bold ${
//           type === "success" ? "bg-green-500" : "bg-red-500"
//         }`}
//       >
//         <p>{message}</p>
//         <button
//           className="mt-2 underline text-sm"
//           onClick={onClose}
//         >
//           Ok
//         </button>
//       </div>
//       <div
//         className="absolute inset-0 bg-black opacity-50"
//         onClick={onClose}
//       ></div>
//     </div>
//   );
// }

interface PopupProps {
  message: string;
  type: "success" | "error" | "info"; // Changed from "success" | "warning" for clarity
  onClose: () => void;
}

function Popup({ message, type, onClose }: PopupProps) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0  backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Popup Card */}
      <div
        className={`relative p-8  text-white font-semibold 
          transform transition-all duration-300 animate-slideUp
          bg-gray-800/40 backdrop-blur-md p-6 shadow-xl border border-white/20 rounded-2xl
          ${isSuccess ? "shadow-[#1CBABA]/20" : "shadow-[#FFB700]/20"}
        `}
      >
        {/* Close Button - Added for better UX */}
        <button
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {isSuccess ? (
            <Check size={48} className="text-[#1CBABA] mb-4 drop-shadow-lg" />
          ) : (
            <X size={48} className="text-[#FFB700] mb-4 drop-shadow-lg" />
          )}
          <p
            className="mb-6 tracking-wide drop-shadow-md"
            style={{ textShadow: "0 0 5px rgba(255,255,255,0.1)" }}
          >
            {message}
          </p>
          <button
            className={`py-3 px-8 rounded-lg font-bold text-base uppercase tracking-wider
              transition-all duration-200 transform hover:scale-105 active:scale-95
              bg-[#1CBABA]/85 cursor-pointer
              shadow-lg shadow-gray-500/30
            `}
            onClick={onClose}
            style={{ textShadow: "0 0 5px rgba(0,0,0,0.3)" }}
          >
            Ok
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}

function Settings() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bioText, setBioText] = useState("One heartbeat matters, the next one");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newProfileFile, setNewProfileFile] = useState<File | null>(null); // To store the new file object
  const [imgSrc, setImgSrc] = useState("/zechi.jpg"); // Default profile image
  const [showTwoFASetup, setShowTwoFASetup] = useState(false);

  // loged user id from context
  const { loggedUserId } = useLoggedUserId();

  // const variable for passowrds when the user will type them
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // this is for popup
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "success"
  );
  const [showPopup, setShowPopup] = useState(false);

  // email and language values
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  // const [language, setLanguage] = useState("English");

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const initialValues = useRef({
    fullName: "",
    bioText: "",
  });

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

  // load the image from local storage if it exists
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered ------>", event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setPopupMessage(
          "Image size exceeds 5MB limit. Please choose a smaller image."
        );
        setPopupType("error");
        setShowPopup(true);
        return; // Stop processing if file is too large
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image loaded successfully ------>", reader.result);
        setImgSrc(reader.result as string);
        setNewProfileFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    const formData = new FormData();
    let hasChanges = false;

    // Check for changes in text fields
    if (fullName !== initialValues.current.fullName) {
      formData.append("fullName", fullName);
      hasChanges = true;
    }
    if (bioText !== initialValues.current.bioText) {
      formData.append("bio", bioText);
      hasChanges = true;
    }

    // Check for password changes
    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);
        formData.append("confirmPassword", confirmPassword); // Backend might expect this
        hasChanges = true;
      } else {
        setPopupMessage("New password and confirm password do not match!");
        setPopupType("error");
        setShowPopup(true);
        return; // Stop the save process
      }
    } else if (
      (oldPassword || newPassword || confirmPassword) &&
      !(oldPassword && newPassword && confirmPassword)
    ) {
      // If any password field is filled, but not all of them
      setPopupMessage(
        "Please fill all password fields if you intend to change your password."
      );
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    // Check for image change
    if (newProfileFile) {
      formData.append("profileImage", newProfileFile);
      hasChanges = true;
    }

    if (!hasChanges) {
      setPopupMessage("No changes to save!");
      setPopupType("info");
      setShowPopup(true);
      return;
    }

    try {
      const res = await fetchWithAuth(
        `/api/settings/update/${loggedUserId}`,
        {
          method: "PATCH", // Use PATCH for partial updates
          body: formData, // No 'Content-Type' header needed for FormData
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.message || `Failed to save profile: ${res.statusText}`
        );
      }

      // Success
      const result = await res.json();
      setPopupMessage(result.message || "All changes saved successfully!");
      setPopupType("success");
      setShowPopup(true);

      // This makes sure subsequent saves compare against the *newly saved* data
      initialValues.current = {
        fullName: fullName,
        bioText: bioText,
      };
      setNewProfileFile(null); // Reset file after successful upload
      setOldPassword(""); // Clear password fields
      setNewPassword("");
      setConfirmPassword("");

      // set the full name and bio
      setFullName(fullName);
      setBioText(bioText);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setPopupMessage(err.message || "Something went wrong during save!");
      setPopupType("error");
      setShowPopup(true);
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

  // user effect to fetch data from the backend from localhost:5000/api/settings/users/1
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/settings/info/${loggedUserId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("Fetched user data:", data);

        // Assuming the backend returns an object with keys: email, language, bio, imageUrl, fullName, userName
        setFullName(data.user.fullName || "mkyn walo");
        setUserName(data.user.userName || "mkyn walo");
        setEmail(data.user.email || "");
        setBioText(data.user.bio || "mkyn walo");
        setImgSrc(data.user.imageUrl); // Set profile image if available
        setIs2FAEnabled(data.user.twofa_enabled);

        initialValues.current = {
          fullName: data.user.fullName || "mkyn walo",
          bioText: data.user.bio || "mkyn walo",
        };
      } catch (error) {
        console.error("Error fetching user data:", error);
        setPopupMessage("Error fetching user data");
        setPopupType("error");
        setShowPopup(true);
      }
    };

    fetchUserData();
  }, []);

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
          <div className="flex items-center justify-center h-[87vh] md:h-[90vh] p-4 w-full flex-1 v">
            <div className="relative w-full md:w-[85%] h-[100%] overflow-hidden  flex items-center justify-center p-4 max-h-[1200px] flex-1
            bg-gray/10 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]  border border-white/30">
              {/* background layers */}
              <div className="absolute inset-0"></div>
              <div className="absolute inset-0"></div>

              {/* content wrapper */}
              <div className="relative z-10 w-full w[90%] h-[100%] rounded-2xl bg-gray-800/40 backdrop-blur-md p-6 shadow-xl border border-white/20 overflow-hidden  text-white pt-6 md:p-4">
                <div className="h-full overflow-y-auto scrollbar">
                  {/* profile image section */}
                  <ProfileImage
                    imgSrc={imgSrc}
                    handleImageUpload={handleImageUpload}
                  />
                  {/* form inputs */}
                  <ProfileInfo
                    fullName={fullName}
                    setFullName={setFullName}
                    userName={userName}
                    is2FAEnabled={is2FAEnabled}
                    setIs2FAEnabled={() => setShowTwoFASetup(true)}
                  />

                  {/* form passowrd */}
                  <ProfilePasswords
                    showOldPassword={showOldPassword}
                    setShowOldPassword={setShowOldPassword}
                    showNewPassword={showNewPassword}
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    oldPassword={oldPassword}
                    setOldPassword={setOldPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                  />

                  {/* form bio */}
                  <ProfileBio
                    bioText={bioText}
                    setBioText={setBioText}
                    textareaRef={textareaRef}
                  />

                  {/* language & email */}
                  <ProfileLanguageEmail email={email} />

                  {/* save button */}
                  <ProfileSavings handleSave={handleSave} />
                </div>
              </div>
            </div>
          </div>
        </main>

        {showPopup && (
          <Popup
            message={popupMessage}
            type={popupType}
            onClose={() => setShowPopup(false)}
          />
        )}

        {/* // Popup section at the end */}
        {showTwoFASetup && (
          <div className="fixed inset-0 backdrop-blur-md animate-fadeIn flex justify-center items-center z-50">
              <TwoFASetup
                is2FAEnabled={is2FAEnabled}
                onClose={() => setShowTwoFASetup(false)}
                onEnable={() => {
                  setIs2FAEnabled(true);
                  setShowTwoFASetup(false);
                }}
                onDisable={() => {
                  setIs2FAEnabled(false);
                  setShowTwoFASetup(false);
                }}
              />
          </div>
        )}

      </div>
    </>
  );
}

export default Settings;

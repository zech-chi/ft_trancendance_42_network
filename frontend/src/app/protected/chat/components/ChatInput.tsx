// this is the chat input component
"use client";
import { BiSolidSend } from "react-icons/bi";
import { SlEmotsmile } from "react-icons/sl";
import { Paperclip, Mic, StopCircle, Trash2, Gamepad2 } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { ChatInputProps } from "../types/typesChat";
// update
import { useAudioRecorder } from "@/app/protected/chat/hooks/useAudioRecorder"; // Import the hook
// update

export default function ChatInput({
  setInputValue,
  inputValue,
  isUploading,
  handleSendMessage,
  handleFileChange,
  error,
  fileInputRef,
  setMessage, // Function to set error messages
}: ChatInputProps) {
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const {
    isRecording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleSendAudio = () => {
    if (audioBlob) {
      const audioFile = new File(
        [audioBlob],
        `audio-message-${Date.now()}.webm`, {type: 'audio/webm'}
      );
      // Create a synthetic event object to pass to handleFileChange
      const syntheticEvent = {
        target: { files: [audioFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleFileChange(syntheticEvent);
      resetRecording(); // Clear the recording state after sending
    }
  };

  // Helper to format the recording time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)Gamepad2
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleOnchaneInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    
    if (error) {
      return ;
    }

    const value  = event.target.value;
    // Limit the input value to 2000 characters
    if (value.trim().length > 2000) {
      setMessage("Message exceeds limit characters. Please shorten your message.");
      return ;
    }
    
    if (value.length <= 2000) {
      setInputValue(value); // Update the input value
    }
  }

  return (
    <div className="relative pt-3">
      {showPicker && (
        <div className="absolute bottom-full mb-2 md:left-7 z-50 emoji-theme-wrapper">
          <Picker
            data={data} // Provide the imported emoji data
            onEmojiSelect={(emoji: {native: string}) => {
              // on emoji select
              setInputValue((prev) => prev + emoji.native); // Append the selected emoji to the input value
            }}
            theme="dark" // Set the theme to dark
            previewPosition="none"
            onClickOutside={() => setShowPicker(false)} // Close the picker when clicking outside
          />
        </div>
      )}
      <div className="flex flex-row justify-between items-center md:mr-6 md:ml-6 md:mb-4 mb-2 mr-4 ml-4 gap-2">
        <div className="p-1 bg-[rgba(255,255,255,0.3)] rounded-[10px] md:rounded-[20px] flex-1 flex flex-row gap-1 md:gap-2">
          {audioBlob ? (
            <div className="flex items-center w-full p-2 gap-2">
              <button onClick={resetRecording} title="Discard recording">
                <Trash2 className="w-6 h-6 text-red-500 hover:text-red-400" />
              </button>
              <div className="h-2 flex-1 bg-gray-500 rounded-full relative">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: "100%" }}
                ></div>
                <span className="absolute right-1.5 ml-2 text-white text-xs whitespace-nowrap">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex">
                <button
                  className="p-2"
                  onClick={() => setShowPicker(!showPicker)}
                >
                  <SlEmotsmile className="text-white w-5 h-5 md:w-6 md:h-6 hover:text-amber-200 cursor-pointer" />
                </button>

                 <button className="p-2" onClick={() => {
                  alert("Game invite feature coming soon!");
                }}>
                  <Gamepad2 className="text-white w-5 h-5 md:w-8 md:h-8 hover:text-amber-200 cursor-pointer" />
                </button>
              </div>

              <TextareaAutosize
                placeholder="Type a message..."
                value={inputValue}
                disabled={isUploading}
                onChange={(e) => handleOnchaneInput(e)}
                onKeyDown={(e) => {
                  // Check for "Enter" WITHOUT the "Shift" key
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevents a new line from being added
                    handleSendMessage();
                  }

                }}
                minRows={1} // Start as a single line
                maxRows={4} // Stop growing after 4 lines and show a scrollbar
                className=" bg-transparent w-full p-2  text-white text-sm md:text-[16px] focus:outline-none resize-none self-center overflow-y-auto scrollbar"
              />
              <button
                className={`p-2 md:mr-2 ${
                  isUploading ? "cursor-not-allowed" : ""
                }`}
                disabled={isUploading}
                onClick={() => {
                  if (error) return;
                  fileInputRef.current?.click(); // Trigger the hidden file input
                }} // Trigger the hidden file input
                title="send a file"
              >
                <Paperclip className="text-white w-5 h-5 md:w-6 md:h-6 hover:text-amber-200 cursor-pointer" />
              </button>
            </>
          )}
        </div>

        <div>
          {inputValue && !audioBlob ? (
            // Show Send button if there is text input
            <button
              className={`w-12 h-12 md:w-13 md:h-13 p-2 bg-[rgba(255,255,255,0.4)] hover:bg-amber-200 
              transition-all duration-150 rounded-full flex items-center justify-center ${
              isUploading ? "cursor-not-allowed" : ""
            }`}
              onClick={handleSendMessage} // Call the function to send the message
              disabled={isUploading}
            >
              <BiSolidSend className="text-black w-9 h-9" />
            </button>
          ) : audioBlob ? (
            // Show Send button if there is an audio blob
            <button
              className="w-12 h-12 md:w-13 md:h-13 p-2 bg-[rgba(255,255,255,0.4)] hover:bg-amber-200 
              transition-all duration-150 rounded-full flex items-center justify-center"
              onClick={handleSendAudio}
              disabled={isUploading}
            >
              <BiSolidSend className="text-black w-9 h-9" />
            </button>
          ) : isRecording ? (
            // Show Stop button if currently recording
            <button
              className="w-12 h-12 flex items-center justify-center hover:scale-125 transition-scale duration-150 cursor-pointer"
              title="Stop Recording"
              onClick={stopRecording}
            >
              <StopCircle className="text-yellow-200 w-8 h-8 animate-pulse" />
            </button>
          ) : (
            // Show Microphone button by default
            <button
              className="w-12 h-12 md:w-13 md:h-13 p-2 bg-[rgba(255,255,255,0.3)] hover:bg-amber-200 hover:text-black
              transition-all duration-150 rounded-full flex items-center justify-center text-white cursor-pointer"
              onClick={startRecording}
              disabled={isUploading}
            >
              <Mic className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}
        </div>

        {/* --- THE HIDDEN FILE INPUT --- */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
          // we can specify which file types are accepted
          // accept="image/*, .pdf, .doc, .docx"
        />
      </div>
    </div>
  );
}
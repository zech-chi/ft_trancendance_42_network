'use client';
import { useLoggedUserId } from "@/context/UserIdContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { fetchWithAuth } from '@/utils/fetchWithAuth';

type TwoFASetupProps = {
    is2FAEnabled: boolean; 
    onClose: () => void;
    onEnable: () => void;
    onDisable: () => void;
};

export default function TwoFASetup({ onClose, onEnable, onDisable, is2FAEnabled }: TwoFASetupProps) {
    const [qr, setQr] = useState<string | null>(null);
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [status, setStatus] = useState("");
    const [isSetupStarted, setIsSetupStarted] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);
    const router = useRouter();
  
    const { loggedUserId } = useLoggedUserId();
    const userId = loggedUserId;
  
    const otp = digits.join("");
    const isCodeComplete = otp.length === 6 && digits.every((d) => d !== "");
  
    const resetInputs = () => {
      setDigits(["", "", "", "", "", ""]);
      // Focus back on the first input
      setTimeout(() => inputRefs.current[0]?.focus(), 10);
    };
  
    // --- LOGIC: Handle Input Change + Auto Submit ---
    const handleDigitChange = (value: string, index: number) => {
      if (!/^\d?$/.test(value)) return;
  
      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);
  
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // CHECK: If all digits are filled, auto-submit
      if (newDigits.every(d => d !== "") && value !== "") {
        const completeOtp = newDigits.join("");
        
        // Determine which action to take based on current mode
        if (!is2FAEnabled && isSetupStarted) {
             handleEnable2FA(completeOtp);
        } else if (is2FAEnabled && isDisabling) {
             handleDisable2FA(completeOtp);
        }
      }
    };
  
    const handlePaste = (e: React.ClipboardEvent) => {
      const pasted = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
      if (!pasted) return;
  
      const newDigits = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setDigits(newDigits);
  
      // If paste fills everything, submit
      if (newDigits.every((d) => d !== "")) {
        inputRefs.current[5]?.focus();
        const completeOtp = newDigits.join("");

        if (!is2FAEnabled && isSetupStarted) {
            handleEnable2FA(completeOtp);
        } else if (is2FAEnabled && isDisabling) {
            handleDisable2FA(completeOtp);
        }
      }
    };
  
    const handleSetup2FA = async () => {
      setStatus("Generating QR...");
      try {
        // Ensure no body is sent, and Content-Type is NOT set to json to avoid the 400 error
        const res = await fetchWithAuth("/api/auth/2fa-setup", {
          method: "POST",
          
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
  
        setQr(data.qr);
        setIsSetupStarted(true);
        setStatus("Scan the QR Code with Authenticator App");
      } catch (err: any) {
        setStatus(err.message);
      }
    };
  
    // --- LOGIC: Enable + Auto Clear on Error ---
    // Accepting optional otpValue allows us to pass the code before state updates
    const handleEnable2FA = async (otpValue?: string) => {
      const codeToUse = otpValue || otp;
      if (codeToUse.length !== 6) return;

      setStatus("Verifying...");
      try {
        const res = await fetchWithAuth("/api/auth/2fa-enable", {
          method: "POST",
          
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: codeToUse }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
  
        setStatus("✅ 2FA enabled!");
        onEnable();
      } catch (err: any) {
        setStatus(err.message || "Verification failed");
        // Auto clear inputs on error
        resetInputs(); 
      }
    };
  
    // --- LOGIC: Disable + Auto Clear on Error ---
    const handleDisable2FA = async (otpValue?: string) => {
      const codeToUse = otpValue || otp;
      if (codeToUse.length !== 6) return;

      setStatus("Verifying...");
      try {
        const res = await fetchWithAuth("/api/auth/2fa-disable", {
          method: "POST",
          
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({otp: codeToUse }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
  
        setStatus("❌ 2FA disabled!");
        resetInputs();
        setIsDisabling(false);
        onDisable();
      } catch (err: any) {
        setStatus(err.message || "Verification failed");
        // Auto clear inputs on error
        resetInputs();
      }
    };
  
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-md p-4">
        <div
          className="relative w-full max-w-[520px] p-6 md:p-8 rounded-3xl 
          shadow-[0_0_40px_rgba(28,186,186,0.45)] 
          bg-gray-800/40 backdrop-blur-xl border border-white/20 text-white
          max-h-[90vh] overflow-y-auto"
        >
          <button
            className="absolute top-4 right-4 cursor-pointer hover:text-white transition"
            onClick={onClose}
          >
            <X size={24} />
          </button>
  
          <h2 className="text-center text-2xl font-bold tracking-wide mb-6">
            Two-Factor Authentication
          </h2>
  
          {!is2FAEnabled ? (
            !isSetupStarted ? (
              <div className="flex justify-center">
                <button
                  onClick={handleSetup2FA}
                  className="w-fit px-3.5 py-3 rounded-xl font-semibold 
                  bg-[#1CBABA]/85
                  hover:opacity-90 transition cursor-pointer"
                >
                  Enable 2FA
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {qr && (
                  <div className="p-3 rounded-xl border border-white/30 bg-black/20 shadow-md">
                    <img src={qr} alt="QR Code" className="rounded-md max-w-full h-auto" />
                  </div>
                )}
  
                <div className="flex gap-2 justify-center w-full" onPaste={handlePaste}>
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { if (el) inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric" 
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(e.target.value, index)}
                      className="w-10 h-12 text-center text-xl font-bold
                      rounded-lg bg-black/25 border border-white/30
                      focus:outline-none focus:ring-2 focus:ring-[#1CBABA]"
                    />
                  ))}
                </div>
  
                <button
                  onClick={() => handleEnable2FA()} // Pass nothing to use state
                  disabled={!isCodeComplete}
                  className="w-full py-3 rounded-xl font-semibold cursor-pointer
                  bg-[#1CBABA]/80 hover:bg-[#1CBABA] transition
                  disabled:opacity-40"
                >
                  Verify & Activate
                </button>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-4">
              {!isDisabling ? (
                <button
                  onClick={() => setIsDisabling(true)}
                  className="w-fit px-3.5 py-3 rounded-xl font-semibold
                  bg-[#FFB700]/80 hover:bg-[#FFB700] transition cursor-pointer"
                >
                  Disable 2FA
                </button>
              ) : (
                <>
                  <div className="flex gap-2 justify-center w-full" onPaste={handlePaste}>
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { if (el) inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(e.target.value, index)}
                        className="w-10 h-12 text-center text-xl font-bold
                        rounded-lg bg-black/25 border border-white/30
                        focus:outline-none focus:ring-2 focus:ring-[#1CBABA]"
                      />
                    ))}
                  </div>
  
                  <button
                    onClick={() => handleDisable2FA()} // Pass nothing to use state
                    disabled={!isCodeComplete}
                    className="w-fit px-3.5 py-3 rounded-xl font-semibold
                    bg-[#1CBABA]/80 hover:bg-[#1CBABA] transition cursor-pointer
                    disabled:opacity-40"
                  >
                    Confirm Disable
                  </button>
                </>
              )}
            </div>
          )}
  
          {status && (
            <p className={`text-center text-sm mt-4 break-words ${status.includes("failed") || status.includes("Error") ? "text-red-400" : "text-white"}`}>
              {status}
            </p>
          )}
        </div>
      </div>
    );
}
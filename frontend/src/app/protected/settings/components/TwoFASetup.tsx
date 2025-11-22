'use client';
import { useLoggedUserId } from "@/context/UserIdContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

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
  
    const handleDigitChange = (value: string, index: number) => {
      if (!/^\d?$/.test(value)) return;
  
      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);
  
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    };
  
    const handlePaste = (e: React.ClipboardEvent) => {
      const pasted = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
      if (!pasted) return;
  
      const newDigits = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setDigits(newDigits);
  
      if (newDigits.every((d) => d !== "")) inputRefs.current[5]?.focus();
    };
  
    const resetInputs = () => setDigits(["", "", "", "", "", ""]);
  
    const handleSetup2FA = async () => {
      setStatus("Generating QR...");
      try {
        const res = await fetch("/api/auth/2fa-setup", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
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
  
    const handleEnable2FA = async () => {
      if (!isCodeComplete) return;
      setStatus("Verifying...");
      try {
        const res = await fetch("/api/auth/2fa-enable", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, otp }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
  
        setStatus("✅ 2FA enabled!");
        onEnable();
      } catch (err: any) {
        setStatus(err.message);
      }
    };
  
    const handleDisable2FA = async () => {
      if (!isCodeComplete) return;
      setStatus("Verifying...");
      try {
        const res = await fetch("/api/auth/2fa-disable", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, otp }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
  
        setStatus("❌ 2FA disabled!");
        resetInputs();
        setIsDisabling(false);
        onDisable();
      } catch (err: any) {
        setStatus(err.message);
      }
    };
  
    return (
      // RESPONSIVE FIX: Added inset-0, bg-black/50 for overlay, and mx-4 for mobile margins
      <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-md p-4">
        <div
          className="relative w-full max-w-[520px] p-6 md:p-8 rounded-3xl 
          shadow-[0_0_40px_rgba(28,186,186,0.45)] 
          bg-gray-800/40 backdrop-blur-xl p-6 shadow-xl border border-white/20 rounded-2xl text-white
          max-h-[90vh] overflow-y-auto"
        >
          <button
            className="absolute top-4 right-4 cursor-pointer hover:text-white transition"
            onClick={onClose}
          >
            <X size={24} />
          </button>
  
          <h2 className="text-center text-2xl font-bold  tracking-wide mb-6">
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
                  onClick={handleEnable2FA}
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
                    onClick={handleDisable2FA}
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
            <p className="text-center text-sm mt-4 break-words">
              {status}
            </p>
          )}
        </div>
      </div>
    );
}
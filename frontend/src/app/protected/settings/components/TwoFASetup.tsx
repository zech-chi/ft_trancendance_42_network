
'use client';
import { useLoggedUserId } from "@/context/UserIdContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TwoFASetupProps = {
    is2FAEnabled: boolean;
    onClose: () => void;
    onEnable: () => void;
    onDisable: () => void;
};

export default function TwoFASetup({ onClose, onEnable, onDisable, is2FAEnabled }: TwoFASetupProps) {
    const [qr, setQr] = useState<string | null>(null);
    const [otp, setOtp] = useState("");
    const [status, setStatus] = useState("");
    const [isSetupStarted, setIsSetupStarted] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false); // 🔹 New state for disabling 2FA
    const router = useRouter();

    const { loggedUserId } = useLoggedUserId();
    const userId = loggedUserId;

    // Step 1: Setup 2FA → get QR code
    const handleSetup2FA = async () => {
        setStatus("Generating QR code...");
        try {
            const res = await fetch("http://localhost:5006/api/auth/2fa-setup", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to setup 2FA");

            setQr(data.qr);
            setIsSetupStarted(true);
            setStatus("Scan the QR code with Google Authenticator");
        } catch (err: any) {
            setStatus(err.message);
        }
    };

    // Step 2: Enable 2FA → send OTP
    const handleEnable2FA = async () => {
        setStatus("Verifying OTP...");
        try {
            const res = await fetch("http://localhost:5006/api/auth/2fa-enable", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to enable 2FA");

            setStatus("✅ 2FA enabled successfully!");
            onEnable(); // 🔹 Notify parent component
            // router.push("/protected");
        } catch (err: any) {
            setStatus(err.message);
        }
    };

    // 🔹 Step 3: Disable 2FA → send OTP
    const handleDisable2FA = async () => {
        setStatus("Verifying to disable 2FA...");
        try {
            const res = await fetch("http://localhost:5006/api/auth/2fa-disable", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to disable 2FA");

            setStatus("✅ 2FA disabled successfully!");
            setIsDisabling(false);
            setOtp("");
            onDisable(); // 🔹 Notify parent component
        } catch (err: any) {
            setStatus(err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) {
            setStatus("Only digits are allowed!");
            return;
        }

        const digits = value.replace(/\D/g, "").slice(0, 6);
        setOtp(digits);
        setStatus("");

        if (digits.length === 6) {
            setStatus("6-digit code entered.");
        }
    };

    const resetInput = () => {
        setOtp("");
        setDisabled(false);
        setStatus("");
    };

    return (
        <div className="relative p-6 flex flex-col items-center gap-4 bg-white rounded-xl shadow-md">

            <button
                className="absolute top-3 right-3  text-black transition-colors duration-200 hover:bg-amber-200"
                onClick={onClose}
            >
                <X size={20} />
            </button>
            <h2 className="text-xl font-bold">Two-Factor Authentication Setup</h2>

            {!is2FAEnabled ? (
                !isSetupStarted ? (
                    <button
                        onClick={handleSetup2FA}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Enable 2FA
                    </button>
                ) : (
                    <>
                        {qr && (
                            <img
                                src={qr}
                                alt="QR Code"
                                className="border p-2 rounded-md shadow-md"
                            />
                        )}

                        <input
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={handleChange}
                            disabled={disabled}
                            className={`border p-2 rounded-md text-center text-lg tracking-widest w-40 transition-colors ${disabled
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-white"
                                }`}
                            maxLength={6}
                        />

                        <button
                            onClick={handleEnable2FA}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Verify & Enable
                        </button>
                    </>
                )
            ) : null}


            {/* 🔹 New Disable 2FA section */}
            {is2FAEnabled && (
                <div className="mt-4 flex flex-col items-center gap-2 pt-4 w-full">
                    {!isDisabling ? (
                        <button
                            onClick={() => setIsDisabling(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                        >
                            Disable 2FA
                        </button>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={handleChange}
                                maxLength={6}
                                className="border p-2 rounded-md text-center text-lg tracking-widest w-40"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDisable2FA}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    Confirm Disable
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <p className="text-sm text-gray-600 mt-2">{status}</p>
        </div>
    );
}

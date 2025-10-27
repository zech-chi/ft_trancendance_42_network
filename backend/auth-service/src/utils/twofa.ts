// @ts-ignore
// Speakeasy.js is a Node.js library primarily used for implementing two-factor authentication (2FA) in web applications. It specializes in generating and validating one-time passwords (OTPs), making it suitable for integrations with authenticator apps like Google Authenticator.
import speakeasy from "speakeasy";

export const generateSecret = () => {
    return speakeasy.generateSecret({
        length: 36,
        name: "FT_transcendence"
    });
};

export const verifyToken = (secret: string, token: string) => {
    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1
    });
};

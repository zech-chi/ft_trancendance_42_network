// @ts-ignore
import speakeasy from "speakeasy";

export const generateSecret = () => {
    return speakeasy.generateSecret({
        length: 20,
        name: "MyApp"
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

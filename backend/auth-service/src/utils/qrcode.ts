import QRCode from "qrcode";

export const generateQRCode = async (text: string) => {
    return QRCode.toDataURL(text);
};

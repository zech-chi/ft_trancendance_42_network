import fs from 'fs';
import path from 'path';


// this is for creating the upload directory
export function createUploadDir() {
    console.log("----------> ", __dirname);
    const uploadDir = path.join(__dirname, '../../uploads');
    console.log('Upload directory path:', uploadDir);

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Upload directory created:', uploadDir);
    } else {
        console.log('Upload directory already exists:', uploadDir);
    }

    return uploadDir;
};

// this is for creating the profiles directory
export function createProfilesDir() {
    const profileDir = path.join(__dirname, '../../uploads/profilesImages');
    console.log('Profile directory path:', profileDir);

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(profileDir)) {
        fs.mkdirSync(profileDir, { recursive: true });
        console.log('Profile directory created:', profileDir);
    } else {
        console.log('Profile directory already exists:', profileDir);
    }

    return profileDir;
}
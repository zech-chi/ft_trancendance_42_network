import fs from 'fs';
import path from 'path';

// this is for creating the profiles directory
export function createProfilesDir() {
    const profileDir = path.join(__dirname, '../../profilesImages');
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
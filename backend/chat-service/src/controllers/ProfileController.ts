import { FastifyRequest, FastifyReply } from "fastify";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { MAX, v4 as uuid4 } from "uuid";
import db from "../db/connectiondb";
import { createProfilesDir } from "../utils/createUploadDir";
import { MAX_LENGTH_BIO, VALID_LANGUAGES } from "../utils/constants";

const pump = promisify(pipeline);


// allowed mimetypes for profile images
const ALLOWED_MIMETYPES_PROFILES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


// check if the mimetype is allowed for profile images
function isAllowedMimeTypeImage(reply: FastifyReply, mimetype: string): boolean {
  if (!ALLOWED_MIMETYPES_PROFILES.includes(mimetype)) {
    reply.status(400).send({
      status: 'error',
      message: `Invalid file type: ${mimetype}. Allowed types are: ${ALLOWED_MIMETYPES_PROFILES.join(', ')}`
    });
    return false;
  }
  return true;
}

// check if the new password and confirm password are the same
function checkPasswordsMatch(reply: FastifyReply, newPassword: string, confirmPassword: string): boolean {
  if (newPassword !== confirmPassword) {
    reply.status(400).send({
      status: 'error',
      message: 'New password and confirm password do not match.'
    });
    return false;
  }
  return true;
}


function checkFiledsIsEmpty(fields: Record<string, string>): boolean {
  return Object.keys(fields).length === 0;
}

// check if one of the fields is empty
function checkFieldsIsEmpty(fields: Record<string, string>): boolean {
  return Object.values(fields).some(value => value.trim() === '');
}


// check the old password in db
async function checkOldPassword(reply: FastifyReply, userId: string, oldPassword: string): Promise<boolean> {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ? AND password = ?');
    const user = stmt.get(userId, oldPassword);
    if (!user) {
      reply.status(400).send({
        status: 'error',
        message: 'Old password is incorrect.'
      });
      return false;
    }
    // If the old password is correct, return true
    return true;
  } catch (error) {
    console.error('Database error:', error);
    reply.status(500).send({
      status: 'error',
      message: 'Internal server error while checking old password.'
    });
    return false;
  }
}


// check length of the passwords
function checkPasswordLength(reply: FastifyReply , newPassword: string, confirmPassowrd: string ): boolean {
  if (newPassword.length < 8 || confirmPassowrd.length < 8) {
    reply.status(400).send({
      status: 'error',
      message: 'New password and confirm password must be at least 8 characters long.'
    });
    return false;
  }

  return true;
}

// validate language
function isValidLanguage(reply: FastifyReply,language: string): boolean {
  if (!VALID_LANGUAGES.includes(language)) {
    reply.status(400).send({
      status: 'error',
      message: `Invalid language: ${language}. Allowed languages are: ${VALID_LANGUAGES.join(', ')}`
    });
    return false;
  }
  return true;
}

// check bio length
function checkBioLength(reply: FastifyReply, bio: string): boolean {
  if (bio.length > MAX_LENGTH_BIO) {
    reply.status(400).send({
      status: 'error',
      message: 'Bio must be less than 150 characters.'
    });
    return false;
  }
  return true;
}


// this function will check if the passowrds is valid and not undefined 
function checkPasswordsValid(reply: FastifyReply, oldPassword: string | undefined, newPassword: string | undefined, confirmPassword: string | undefined): boolean {
  console.log("mara min hona %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", oldPassword, newPassword, confirmPassword);
  if (oldPassword || newPassword || confirmPassword) {
    if (!oldPassword || !newPassword || !confirmPassword) {
      reply.status(400).send({
        status: 'error',
        message: 'Old password, new password and confirm password are required.'
      });
      return false;
    }

    // check length of the passwords
    if (!checkPasswordLength(reply, newPassword, confirmPassword)) {
      return false;
    }

    // check if the new password and confirm password are the same
    if (!checkPasswordsMatch(reply, newPassword, confirmPassword)) {
      return false;
    }
  }

  return true;
}

// function to update user settings
export async function UpdateProfile(request: FastifyRequest, reply: FastifyReply) {

  // extract the user id from the request params

  // Uncomment the following line if you have user authentication middleware after merging
  // const user = request.user;
   const { id } = request.params as { id: string };
  
  if (!id) {
    return reply.status(400).send({ status: 'error', message: 'User ID is required.' });
  }

  console.log("Received request to update user settings:", request);
  const profileDir = createProfilesDir();

  const parts = request.parts();
   const fields: Record<string, string> = {};
   let profileImagePath: string | null = null;


  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'profileImage') {

      // check if the mimetype is allowed
      if (!isAllowedMimeTypeImage(reply, part.mimetype)) {
        return; // return if the mimetype is not allowed
      }

      const saveTo = path.join(profileDir, `${uuid4()}-${part.filename}`);
      await pump(part.file, fs.createWriteStream(saveTo));
      profileImagePath = `${saveTo}`;
    } else if (part.type === 'field') {
      console.log(`Received field: ${part.fieldname} with value: ${part.value}`);
      // Store the field value in the fields object
      if (part.fieldname.includes('Password')) {
        fields[part.fieldname] = part.value as string;
      }
      else {
        if (typeof part.value === 'string') {
          console.log(`Field ${part.fieldname} is a string: ${part.value}`);
          fields[part.fieldname] = part.value.trim();
        } else {
          fields[part.fieldname] = String(part.value).trim();
        }
      }
    }
  }


  // Check if fields are empty
  if (checkFiledsIsEmpty(fields) && profileImagePath === null) {
    return reply.status(400).send({ status: 'error', message: 'No fields provided to update.' });
  }

  // Check if any field is empty
  if (checkFieldsIsEmpty(fields)) {
    return reply.status(400).send({ status: 'error', message: 'Some fields are empty.' });
  }

  // extract all the fields from the fields object
  const { firstName, lastName, language, bio, oldPassword, newPassword, confirmPassowrd} = fields;
  const updates: string[] = [];
  const values: string[] = [];

  // Check if passwords are valid
  if (!checkPasswordsValid(reply, oldPassword, newPassword, confirmPassowrd)) {
    return; // If passwords are not valid, exit the function
  }

  if (firstName) {
    updates.push('firstName = ?');
    values.push(firstName);
  }

  if (lastName) {
    updates.push('lastName = ?');
    values.push(lastName);
  }

  if (language) {
    // Validate the language
    if (!isValidLanguage(reply, language)) {
      return; // If language is not valid, exit the function
    }
    updates.push('language = ?');
    values.push(language);
  }

  if (bio) {
    // Check the length of the bio
    if (!checkBioLength(reply, bio)) {
      return; // If bio length is invalid, exit the function
    }
    updates.push('bio = ?');
    values.push(bio);
  }

  if (oldPassword && newPassword && confirmPassowrd) {
    // If old password is provided, we assume the user wants to change the password
    // ! here i should hash the password before storing it using bcrypt or similar library after merging
    if (!await checkOldPassword(reply, id, oldPassword)) {
      return; // If old password check fails, exit the function
    }
    updates.push('password_hash = ?');
    values.push(newPassword); // In a real application, you would hash this password before storing it
  }
  
  
  console.log('Fields:', fields);
  console.log('Profile image:', profileImagePath);
  console.log(`Updating settings for user ID: ${id}.`);

  // prepare the SQL update statement
    // * const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
  // Add the user ID to the values array
  values.push(id);
  //  * console.log('SQL Update Statement:', stmt); uncomment this line to see the SQL statement in the console
  // * const result = stmt.run(...values); uncomment this line to run the SQL statement

  // Here you would typically update user settings in the database
  // For demonstration, we return a success response
  return reply.status(200).send({ status: 'success', message: 'Settings updated successfully' });
}



// this function is to get the profile image to implement later
export async function getProfileImage(request: FastifyRequest, reply: FastifyReply) {
  console.log("Received request to get profile image:", request.params);
  console.log("to implement later");
  return reply.status(501).send({ status: 'error', message: 'Not implemented yet' });
}
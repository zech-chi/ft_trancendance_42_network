import { FastifyRequest, FastifyReply } from "fastify";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { MAX, v4 as uuid4 } from "uuid";
import bcrypt from "bcryptjs";
// import db from "../db/connectiondb";
import { createProfilesDir } from "../utils/createProfilesDir";
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
      // const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      // const user = stmt.get(userId);
      // fetch from the db user http://localhost:5000/api/settings/users/${userId}
      const response = await fetch(`http://db-service:5000/api/settings/users/${userId}`);
      if (!response.ok) {
        reply.status(400).send({
          status: 'error',
          message: 'Failed to fetch user data from database.'
      });
        return false;
      }

      const data = await response.json();
      const user = data.user;
      console.log("Fetched user for old password check:", user);

      if (!user) {
        reply.status(400).send({
          status: 'error',
          message: 'User not found.'
      });
        return false;
    }

    //Compare the old password with the hashed password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
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
    reply.status(400).send({
      status: 'error',
      message: 'something went wrong while checking old password.'
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
    console.log("Processing part:", part);
    if (part.type === 'file' && part.fieldname === 'profileImage') {

      // check if the mimetype is allowed
      if (!isAllowedMimeTypeImage(reply, part.mimetype)) {
        return; // return if the mimetype is not allowed
      }

       // Check if a profile image has already been uploaded
      if (profileImagePath !== null) {
        // ! should remove the already uploaded file
        // if (fs.existsSync(profileImagePath)) {
        //   fs.unlinkSync(profileImagePath);
        // }
        return reply.status(400).send({
          status: 'error',
          message: 'Only one profile image is allowed.'
        });
      }

      const saveTo = path.join(profileDir, `${uuid4()}-${part.filename}`);
      console.log(`Saving profile image to ${saveTo}`);
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
  const {fullName ,language, bio, oldPassword, newPassword, confirmPassword} = fields;
  const updates: string[] = [];
  const values: string[] = [];

  // Check if passwords are valid
  if (!checkPasswordsValid(reply, oldPassword, newPassword, confirmPassword)) {
    return; // If passwords are not valid, exit the function
  }

  // add profile image to the updates if it exists
  if (profileImagePath) {
    // the url should store it as http://localhost:5003/api/settings/profileImage/filename
    updates.push('imageUrl = ?');
    values.push(`/api/settings/profileImage/${path.basename(profileImagePath)}`);
  }

  if (fullName) {
    updates.push('fullName = ?');
    values.push(fullName);
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

  if (oldPassword && newPassword && confirmPassword) {
    // If old password is provided, we assume the user wants to change the password
    // ! here i should hash the password before storing it using bcrypt or similar library after merging
    if (!await checkOldPassword(reply, id, oldPassword)) {
      return; // If old password check fails, exit the function
    }
    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Old password is correct, proceeding to update to new password.");
    updates.push('password = ?');
    values.push(hashedPassword); // In a real application, you would hash this password before storing it
  }
  
  
  console.log('Fields:', fields);
  console.log('Profile image:', profileImagePath);
  console.log(`Updating settings for user ID: ${id}.`);

  // prepare the SQL update statement
  // const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
  // Add the user ID to the values array
  // values.push(id);
  // console.log('SQL Update Statement:', stmt); //uncomment this line to see the SQL statement in the console
  // * const result = stmt.run(...values); uncomment this line to run the SQL statement

  // Here you would typically update user settings in the database
  // For demonstration, we return a success response
  console.log(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
  console.log('With values:', values);

  // fetch to the db to update the user http://localhost:5000/api/settings/users/updateprofile/${id}
  try {
    const response = await fetch(`http://db-service:5000/api/settings/users/updateprofile/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates, values}),
    });

    if (!response.ok) {
      return reply.status(400).send({
        status: 'error',
        message: 'Failed to update user settings.'
      });
    }

    const data = await response.json();
    console.log('User settings updated successfully:', data);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return reply.status(400).send({
      status: 'error',
      message: 'something went wrong while updating user settings.'
    });
  }

  // If everything is successful, return a success response
  return reply.status(200).send({ status: 'success', message: 'Settings updated successfully' });
}


// get user info function
export async function getUserInfo(request: FastifyRequest, reply: FastifyReply) {

  // the userId should get it from the request.user object after authentication
  const userId = request.params.id;
  try {
    const response = await fetch(`http://db-service:5000/api/settings/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data from database.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database error:', error);
    return reply.status(400).send({
      status: 'error',
      message: 'something went wrong while fetching user data.'
    });
  }
}

// exmaple curl to test getUserInfo function
// curl -X GET http://localhost:5004/api/settings/info/6



// this function is to get the profile image to implement later
export async function getProfileImage(request: FastifyRequest, reply: FastifyReply) {
 console.log(" mara min hona Received request to get file:", request.params);
  try {
    
    // Require logged-in user (add real auth check here)
    // const user = request.user;
    // if (!user) {
      //     return reply.status(403).send({ error: 'Unauthorized' , message: 'You must be logged in to access this resource.' });
      // }
      
    const filename = (request.params as { '*': string })['*'];
    console.log("Getting file:", filename);
    if (!filename) {
      return reply
        .status(400)
        .send({ status: "error", message: "Filename is required." });
    }
    // Define the path to the uploads directory
    const uploadDir = createProfilesDir();

    const Sanitizefilename = path.basename(filename); // Sanitize filename to prevent path traversal

    // Construct the full file path
    const filePath = path.join(uploadDir, Sanitizefilename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return reply
        .status(404)
        .send({ status: "error", message: "File not found." });
    }

    const encodedName = encodeURIComponent(Sanitizefilename);

    reply.header('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`);

    return reply.send(fs.createReadStream(filePath));
  } catch (error) {
    console.error("Error retrieving file:", error);
    return reply
      .status(400)
      .send({ status: "error", message: "something go wrong while geting the file!" });
  }
}
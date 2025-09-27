
// this file will handle file uploads
// import { pdf } from "pdf-to-img";
import { FastifyRequest, FastifyReply } from "fastify";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import db from "../db/connectiondb";
import { createUploadDir } from "../utils/createUploadDir";
import { v4 as uuid4 } from "uuid";
import { MAX_AUDIO_SIZE_IN_BYTES, MAX_FILE_SIZE_IN_BYTES } from "../utils/constants";
import { fromPath } from "pdf2pic"
import { getTime } from "../utils/getTime";
import { MessageRequestBody } from "../types/message";
import { checkIds } from "../utils/utilsControllerChat";
import { ALLOWED_MIMETYPES_CHAT } from "../utils/constants";
import { sendMessageToUser } from "../socket/socket";
import { ApidataBase } from "../utils/ApiDataBase";

// Promisify the pipeline function to use it with async/await
const pump = promisify(pipeline);

// get the type of file is image or file
function getFileType(mimetype: string): "image" | "file" | "audio" {
  if (mimetype.startsWith("image/")) {
    return "image";
  }
  if (mimetype.startsWith("audio/")) {
    return "audio";
  }
  return "file";
}

// check if is pdf
function isPdf(mimetype: string): boolean {
  return mimetype === "application/pdf";
}

// check if the request is multipart/form-data
// and handle the file upload
function isMultipart(request: FastifyRequest, reply: FastifyReply): boolean {
  if (!request.isMultipart()) {
    reply
      .status(415) // 415 Unsupported Media Type
      .send({
        status: "error",
        message: "Invalid request format. Expected multipart/form-data.",
      });
    return false;
  }
  return true;
}

// check if is alowed mimetype
function isAllowedMimeType(reply: FastifyReply, mimetype: string): boolean {
  if (!ALLOWED_MIMETYPES_CHAT.includes(mimetype)) {
    reply.status(400).send({
      status: "error",
      message: `Invalid file type: ${mimetype}. Allowed types are: ${ALLOWED_MIMETYPES_CHAT.join(", ")}`,
    });
    return false;
  }
  return true;
}

// check if the request contains datafile 
function checkDataFile(reply: FastifyReply, data: any): boolean {

  if (!data || data.filename === "") {
    reply.status(400).send({
      status: "error",
      message: "No file uploaded.",
    });
    return false; // No file uploaded
  }
  return true; // File is present
}

// check limit size for the request
function checkSizeLimit(
  request: FastifyRequest,
  reply: FastifyReply
): boolean {
  const contentLength = request.headers["content-length"]
    ? parseInt(request.headers["content-length"])
    : 0;

  if (
    contentLength > MAX_FILE_SIZE_IN_BYTES ||
    (getFileType(request.headers["content-type"] || "") === "audio" &&
      contentLength > MAX_AUDIO_SIZE_IN_BYTES)
  ) {
    console.error("File size exceeds limit:", contentLength);
    reply.status(400).send({
      error: "ko",
      message: `File size exceeds the limit of ${
        getFileType(request.headers["content-type"] || "") === "audio"
          ? MAX_AUDIO_SIZE_IN_BYTES
          : MAX_FILE_SIZE_IN_BYTES
      } MB.`,
    });
    return false;
  }
  return true;
}

// check if the file truncated
async function checkFileTruncated(reply: FastifyReply , data: any, filePath: string): Promise<boolean> {
  if (data.file.truncated) {
    await data.file.resume(); // Consume the stream to prevent hanging

    // delete the file if it was truncated
    fs.unlinkSync(filePath);
    reply.status(400).send({
      error: "ko",
      message: `File size exceeds the limit of ${ getFileType(data.mimetype) === "audio" ? MAX_AUDIO_SIZE_IN_BYTES : MAX_FILE_SIZE_IN_BYTES } MB.`,
    });
    return false; // File was truncated
  }

  return true; // File was not truncated
}

// insert the message into the database
async function insertIntoDatabase(from: string, to: string, data: any, filename: string, fileUrl: string, thumbnailPath: string | null) {
  const timeSend = getTime();
  // Save file metadata to the database
  const stmt = db.prepare(`
    INSERT INTO messages (sender_id, receiver_id, message,type, url, file_name, thumbnail_url, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // const result = stmt.run(
  //   from, // sender_id
  //   to, // receiver_id
  //   getFileType(data.mimetype),
  //   getFileType(data.mimetype), // type
  //   fileUrl, // url
  //   filename, // file_name
  //   thumbnailPath,
  //   timeSend, // timestamp
  // );

  // // get the last inserted id
  // const id = result.lastInsertRowid;
  
  const response = await fetch(ApidataBase.addFileMsg, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from,
      to: to,
      message: getFileType(data.mimetype),
      fileType: getFileType(data.mimetype),
      fileUrl: fileUrl,
      filename: filename,
      thumbnailPath: thumbnailPath,
      timeSendMessage: timeSend,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to save file metadata`);
  }

  const responseData = await response.json();
  const id = responseData.messageId;
  console.log("File metadata saved to database with ID:", id);

  // send the message via socket.io
   const messageData = {
    id: id,
    url: fileUrl, // Return the URL of the uploaded file
    thumbnail: thumbnailPath, // Return the thumbnail path if applicable
    fileName: filename, // Return the filename
    type: getFileType(data.mimetype), // Return the file type
    time: timeSend.slice(11, 16), // Return the time of upload
    sent: false, // Assuming the file is sent immediately after upload
    from: from, // sender_id
    to: to, // receiver_id
  };

  return messageData;
}

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {


  if (!isMultipart(request, reply)) {
    return; // If the request is not multipart, exit the function
  }

  // uncomment this when we merge with the authentication system
  // const user = request.user;
 
  
  // extract the from and to ids from params
  const {from, to} = request.params as { from: string, to: string };
  console.log(`#######################################File upload request from user ${from} to contact ${to}`);

    // Validate from and to fields
    // if (!from || !to) {
    //   return reply.status(400).send({
    //     status: "error",
    //     message: "Invalid request. Please provide from and to fields.",
    //   });
    // }
    
    // if (from === to) {
    //   return reply.status(400).send({
    //     status: "error",
    //     message: "You cannot send a file to yourself.",
    //   });
    // }
    if (!checkIds(reply, from, to, "You cannot send a file to yourself.")){
      return; // If checkIds returns false, exit the function
    }

    const data = await request.file();
    const uploadDir = createUploadDir();

  // console.log("File upload request received:", data);
  
  // Check if the file data is valid
  if (!checkDataFile(reply, data) || !data) {
    return; // If no file is uploaded, exit the function
  }

  console.log("mimetype:", data.mimetype);
  // Check if the file type is allowed
  if (!isAllowedMimeType(reply, data.mimetype)) {
    return; // If the mimetype is not allowed, exit the function
  }

  try {
    // check if size limit is exceeded using content-length header
    if (!checkSizeLimit(request, reply)) {
      return; // If size limit is exceeded, exit the function
    }

    // Sanitize filename to prevent path traversal.
    const filename = path.basename(data.filename);
    const sanitizedFilename = uuid4() + filename;
    const filePath = path.join(uploadDir, sanitizedFilename);
    // const fileUrl = `${request.protocol}://${request.hostname}:5000/api/chat/uploads/${sanitizedFilename}`; // the port should be in env file
    const fileUrl = `api/chat/uploads/${sanitizedFilename}`; // this is for nginx when the fron-end on https

    // Pipe the stream directly to a file. This is memory-efficient and non-corrupting.
    await pump(data.file, fs.createWriteStream(filePath));

    if (!checkFileTruncated(reply, data, filePath)) {
      return; // If the file was truncated, exit the function
    }

    // check if is pdf
    let thumbnailPath: string | null = null;
    if(isPdf(data.mimetype)) {
      console.log("File is a PDF, converting to images...");
      thumbnailPath = await ConvertFirstPageToImage(filePath);
      if (thumbnailPath) {
        thumbnailPath = `${request.protocol}://${request.hostname}:5000/api/chat/uploads/${thumbnailPath}`;
      }
    }
    
    const messageData = await insertIntoDatabase(from, to, data, filename, fileUrl, thumbnailPath);

    // Emit the message to the specific user
    sendMessageToUser(to, messageData);

    return reply.status(200).send({
      status: "success",
      message: "File uploaded successfully.",
      url: fileUrl, // Return the URL of the uploaded file
      thumbnail: thumbnailPath, // Return the thumbnail path if applicable
      filename: filename, // Return the filename
      type: getFileType(data.mimetype), // Return the file type
      time: messageData.time, // Return the time of upload
      sent: true, // Assuming the file is sent immediately after upload
      id: messageData.id, // Return the last inserted ID
    });

  } catch (err) {
    console.error("Failed to save file:", err);
    return reply.status(400).send({
      status: "error",
      message: "Could not save the file.",
    });
  }
}

// function to get a file from uploads directory
export async function getFile(request: FastifyRequest, reply: FastifyReply) {
  console.log(" mara min hona Received request to get file:", request.params);
  try {
    
    // Require logged-in user (add real auth check here)
    const user = request.user;
    // if (!user) {
      //     return reply.status(403).send({ error: 'Unauthorized' , message: 'You must be logged in to access this resource.' });
      // }
      
    const filename = (request.params as { '*': string })['*'];
    if (!filename) {
      return reply
        .status(400)
        .send({ status: "error", message: "Filename is required." });
    }
    // Define the path to the uploads directory
    const uploadDir = createUploadDir();

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

// Function to convert PDF to images
async function ConvertFirstPageToImage(pdfPath: string): Promise<string | null> {

  console.log("Converting PDF to images...--------------------------->>>>");
  const outputDir = createUploadDir();

  const options = {
    density: 100,
    saveFilename: uuid4(),
    savePath: outputDir,
    format: "png",
    width: 800,
    height: 600,
  };
  
  try {
    const converter = fromPath(pdfPath, options);
    const result = await converter(1, { responseType: "image" });
    console.log("Image saved at:", result.path); // ✅ result.path is the file path
    return result.name ?? null;
  } catch (error) {
    console.error("Failed to convert PDF to image:", error);
  }
  return null; // Return null if conversion fails
}
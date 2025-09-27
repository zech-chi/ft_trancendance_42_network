export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
    if (!request.isMultipart()) {
      return reply.status(415).send({
        status: "error",
        message: "Invalid request format. Expected multipart/form-data.",
      });
    }
  
    const { from, to } = request.params as { from: string; to: string };
    console.log(`#######################################File upload request from user ${from} to contact ${to}`);
  
    if (!checkIds(reply, from, to, "You cannot send a file to yourself.")) {
      return;
    }
  
    const uploadDir = createUploadDir();
    let savePathfile = null;
    let fileSaved = false;
    let savedFileData: any = null;
    let fileCount = 0;
  
    for await (const part of request.parts()) {
      if (part.type === "file") {
        fileCount++;
        if (fileCount > 1) {
          console.error("Too many files in request");
          await part.file.resume(); // discard file stream
          if (savePathfile) {
              fs.unlinkSync(savePathfile); // delete the previously saved file if any
          }
          return reply.status(400).send({
            error: "ko",
            message: "Cannot upload more than one file in a single request.",
          });
        }
  
        console.log(`Received file: ${part.filename} with mimetype: ${part.mimetype}`);
  
        // Basic checks
        if (!ALLOWED_MIMETYPES_CHAT.includes(part.mimetype)) {
          console.error("Invalid file type:", part.mimetype);
          await part.file.resume();
          return reply.status(400).send({
            error: "ko",
            message: "Invalid file type. Only JPEG, PNG, and PDF files are allowed.",
          });
        }
  
        const contentLength = request.headers["content-length"]
          ? parseInt(request.headers["content-length"])
          : 0;
  
        if (
          contentLength > MAX_FILE_SIZE_IN_BYTES ||
          (getFileType(part.mimetype) === "audio" &&
            contentLength > MAX_AUDIO_SIZE_IN_BYTES)
        ) {
          console.error("File size exceeds limit:", part.filename);
          await part.file.resume();
          return reply.status(400).send({
            error: "ko",
            message: `File size exceeds the limit of ${
              getFileType(part.mimetype) === "audio"
                ? MAX_AUDIO_SIZE_IN_BYTES
                : MAX_FILE_SIZE_IN_BYTES
            } MB.`,
          });
        }
  
        // Save file
        const originalName = path.basename(part.filename);
        const sanitizedFilename = uuid4() + originalName;
        const filePath = path.join(uploadDir, sanitizedFilename);
        const fileUrl = `api/chat/uploads/${sanitizedFilename}`;
        savePathfile = filePath; // Save the path for later use
  
        await pump(part.file, fs.createWriteStream(filePath));
  
        if (part.file.truncated) {
          console.error("File upload was truncated:", part.filename);
          fs.unlinkSync(filePath);
          return reply.status(400).send({
            error: "ko",
            message: `File size exceeds the limit of ${
              getFileType(part.mimetype) === "audio"
                ? MAX_AUDIO_SIZE_IN_BYTES
                : MAX_FILE_SIZE_IN_BYTES
            } MB.`,
          });
        }
  
        let thumbnailPath: string | null = null;
        if (isPdf(part.mimetype)) {
          console.log("File is a PDF, converting to images...");
          thumbnailPath = await ConvertFirstPageToImage(filePath);
          if (thumbnailPath) {
            thumbnailPath = `${request.protocol}://${request.hostname}:5000/api/chat/uploads/${thumbnailPath}`;
          }
        }
  
        const timeSend = getTime();
        const stmt = db.prepare(`
          INSERT INTO messages (sender_id, receiver_id, message, type, url, file_name, thumbnail_url, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
  
        const result = stmt.run(
          from,
          to,
          getFileType(part.mimetype),
          getFileType(part.mimetype),
          fileUrl,
          originalName,
          thumbnailPath,
          timeSend
        );
  
        const id = result.lastInsertRowid;
  
        const messageData = {
          id,
          url: fileUrl,
          thumbnail: thumbnailPath,
          fileName: originalName,
          type: getFileType(part.mimetype),
          time: timeSend.slice(11, 16),
          sent: false,
          from,
          to,
        };
  
        sendMessageToUser(to, messageData);
  
        fileSaved = true;
        savedFileData = {
          status: "success",
          message: "File uploaded successfully.",
          url: fileUrl,
          thumbnail: thumbnailPath,
          filename: originalName,
          type: getFileType(part.mimetype),
          time: timeSend.slice(11, 16),
          sent: true,
          id,
        };
      } 
      else if (part.type === "field") {
        const field = part as MultipartField;
        console.log(`Received field: ${field.value}`);
      }
    }
  
    if (!fileSaved) {
      return reply.status(400).send({
        status: "error",
        message: "No file uploaded.",
      });
    }
  
    return reply.status(200).send(savedFileData);
  }
'use client';
import { File, Download } from 'lucide-react';
import { useEffect } from 'react';

interface FileBlockProps {
  url: string;
  fileName: string;
  fileSize?: string;
  thumbnailUrl?: string;
  messageEndRef?: React.RefObject<HTMLDivElement | null>;
}

export const FileBlock: React.FC<FileBlockProps> = ({ url, fileName, fileSize, thumbnailUrl, messageEndRef }) => {
  // rounded just if file name is not pdf, because pdfs have their own thumbnail
  let rounded = true;
  if (fileName && fileName.endsWith('.pdf')) {
    rounded = false;
  }

  // Scroll when file is rendered
  useEffect(() => {
    if (messageEndRef?.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      {thumbnailUrl && <div><img src={thumbnailUrl} alt={`Preview of ${fileName}`} className="max-w-full max-h-[250px] rounded-t-lg" /></div>}
      <a
        href={url}
        download={fileName} // Use the fileName for download
        // target="_blank" // Open in new tab for safety
        // rel="noopener noreferrer"
        className={`flex items-center gap-3 p-3 bg-black/20 hover:bg-black/40 transition-colors duration-200 w-full ${rounded ? 'rounded-lg' : 'rounded-b-lg'}`}
      >
        {/* File Icon */}
        <div className="flex-shrink-0 p-2 bg-gray-500 rounded-full">
          <File className="w-5 h-5 text-white" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{fileName}</p>
          {fileSize && <p className="text-xs text-gray-300">{fileSize}</p>}
        </div>

        {/* Download Icon */}
        <div className="flex-shrink-0">
          <Download className="w-5 h-5 text-gray-300" />
        </div>
      </a>
    </>
  );
};
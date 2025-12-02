'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ImageLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageLightbox ({ imageUrl, onClose }: ImageLightboxProps) {

  // Handle closing when the Escape key is pressed
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Add/remove event listener for the Escape key
  useEffect(() => {
    // If no image URL is provided, don't render anything
    if (!imageUrl) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If the click is on an element that is NOT inside the image container...
      if (!target.closest('.image-container')) {
        onClose();
      }
    };

    // Add listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    // Return a cleanup function to remove the listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // Dependency array

  if (!imageUrl) return null;

  return (
    // Backdrop: Fixed position, covers the screen, with a semi-transparent background
    <div 
      className="absolute inset-0 bg-gray-800/60 flex items-center justify-center z-70 animate-fade-in backdrop-blur-md rounded-2xl"
      onClick={onClose} // Close the lightbox when clicking the backdrop
    >
      {/* Close button in the top right corner */}
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white z-70 cursor-pointer"
        onClick={onClose}
        title="Close (Esc)"
      >
        <X size={32} />
      </button>

      {/* Image container: prevents closing when the image itself is clicked */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh]"
      >
        <img
          src={imageUrl}
          alt="Enlarged chat image"
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
};
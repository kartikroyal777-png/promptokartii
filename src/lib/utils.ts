export const getTransformedImageUrl = (url: string, width: number = 800, quality: number = 80): string => {
  if (!url) return '';
  
  // Check if it's a Supabase Storage URL
  if (url.includes('supabase.co/storage/v1/object/public')) {
    // If it already has query params, append; otherwise start with ?
    const separator = url.includes('?') ? '&' : '?';
    // Use Supabase Image Transformation
    // resize=contain or cover can be used. 'cover' is usually better for cards.
    // Added format=webp for better compression and faster loading
    return `${url}${separator}width=${width}&quality=${quality}&resize=cover&format=webp`;
  }

  return url;
};

/**
 * Compresses an image file to a target size (default 200KB) by iteratively reducing quality.
 */
export const compressImage = async (file: File, maxWidth: number = 1200, targetSizeKB: number = 200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject(new Error('Image compression is only supported in the browser.'));
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Initial resize if image is too large (e.g. 4K images)
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
        }
        
        // Draw image to canvas once
        ctx.drawImage(img, 0, 0, width, height);
        
        // Recursive function to find the best quality
        const attemptCompression = (quality: number) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Compression failed'));
                    return;
                }

                // If blob is under target size OR quality is already low (0.5), we stop.
                // We don't want to go below 0.5 quality as it looks bad.
                if (blob.size <= targetSizeKB * 1024 || quality <= 0.5) {
                    // If still too big after dropping quality, we could resize recursively, 
                    // but for now we'll accept the result to avoid infinite loops.
                    // Most 1200px images at 0.5 quality are well under 200KB.
                    resolve(blob);
                } else {
                    // Reduce quality by 0.1 and try again
                    attemptCompression(parseFloat((quality - 0.1).toFixed(1)));
                }
            }, 'image/jpeg', quality);
        };

        // Start with quality 0.9
        attemptCompression(0.9);
      };
      
      img.onerror = (err) => reject(new Error('Failed to load image for compression'));
    };
    
    reader.onerror = (err) => reject(new Error('Failed to read file'));
  });
};

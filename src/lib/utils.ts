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

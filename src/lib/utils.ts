export const getTransformedImageUrl = (url: string, width: number, height: number): string => {
  if (!url || !url.includes('supabase.co')) {
    return url;
  }
  try {
    const urlObj = new URL(url);
    // Path for render endpoint: /storage/v1/render/image/public/{bucket}/{path}
    // Path from getPublicUrl: /storage/v1/object/public/{bucket}/{path}
    if (urlObj.pathname.includes('/object/public/')) {
        const newPathname = urlObj.pathname.replace('/object/public/', '/render/image/public/');
        urlObj.pathname = newPathname;
        urlObj.searchParams.set('width', width.toString());
        urlObj.searchParams.set('height', height.toString());
        urlObj.searchParams.set('resize', 'cover');
        return urlObj.toString();
    }
    return url;
  } catch (error) {
    console.error("Failed to transform image URL:", error);
    return url;
  }
};

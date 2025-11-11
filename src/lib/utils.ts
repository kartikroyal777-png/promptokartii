export const getTransformedImageUrl = (url: string): string => {
  if (!url || !url.includes('supabase.co')) {
    return url;
  }

  // --- FIX: Force direct URL ---
  // The image transformation API (resizing) can sometimes be blocked by ad blockers or
  // have complex permission issues. To ensure images are always visible, we will now
  // use the direct, untransformed public URL from Supabase storage.
  // This is a more robust approach to guarantee visibility.

  // The original URL from `getPublicUrl` is already the direct link we need.
  return url;
};

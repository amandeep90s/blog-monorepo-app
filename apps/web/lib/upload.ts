import { createClient } from "@supabase/supabase-js";

/**
 * Upload thumbnail image to Supabase Storage
 * @param image
 * @returns
 */
export async function uploadThumbnail(image: File) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseApiKey = process.env.SUPABASE_API_KEY!;

  const supabase = createClient(supabaseUrl, supabaseApiKey);

  const data = await supabase.storage.from("thumbnails").upload(`${image.name}_${Date.now()}`, image);

  if (!data.data?.path) throw new Error("Thumbnail upload failed");

  const urlData = supabase.storage.from("thumbnails").getPublicUrl(data.data.path);

  return urlData.data.publicUrl;
}

/**
 * Delete image from Supabase Storage using the public URL
 * @param imageUrl - The public URL of the image to delete
 * @returns
 */
export async function deleteImage(imageUrl: string) {
  if (!imageUrl) return;

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseApiKey = process.env.SUPABASE_API_KEY!;

  const supabase = createClient(supabaseUrl, supabaseApiKey);

  // Extract the file path from the public URL
  // URL format: https://[project].supabase.co/storage/v1/object/public/thumbnails/filename
  const urlParts = imageUrl.split("/storage/v1/object/public/thumbnails/");
  if (urlParts.length !== 2) {
    console.warn("Invalid image URL format:", imageUrl);
    return;
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage.from("thumbnails").remove([filePath]);

  if (error) {
    console.error("Failed to delete image from Supabase:", error);
    throw new Error("Failed to delete image");
  }
}

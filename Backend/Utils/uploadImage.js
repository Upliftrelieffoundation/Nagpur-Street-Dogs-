import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary Config Status:", {
  hasCloudName: !!cloudName,
  hasApiKey: !!apiKey,
  hasApiSecret: !!apiSecret,
  cloudName: cloudName || "not-found"
});

// Configure with environment variables
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export default async function uploadImageCloudinary(buffer) {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary environment variables are missing on the server.");
    }

    // Convert buffer to base64 string
    const base64String = buffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64String}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      folder: "user_uploads",
      quality: "auto:good" // Optimize image quality
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error details:", error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message || error}`);
  }
}
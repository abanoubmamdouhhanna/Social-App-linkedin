import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = async (file, folderpath, publicId) => {
  if (!file?.path) return null;
  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: folderpath,
      public_id: publicId,
    });
    return uploadResult.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload ${publicId}`, { cause: 500 });
  }
};

// Helper function to delete resources by folder
export const deleteFromCloudinary = async (folderPath) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources_by_prefix(folderPath, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      // Also delete the empty folder after resources are removed
      cloudinary.api.delete_folder(folderPath, (folderError) => {
        if (folderError) {
          console.warn("Could not delete empty folder:", folderError);
        }
        resolve(result);
      });
    });
  });
};

import express from "express";
import { v2 as cloudinaryV2 } from "cloudinary";
import multer from "multer";
import supabase from "../Utils/supabase.js";
import {
  addComment, DraftBlog, getBlog, getBlogData, getCommentData,
  getSpecificTag, isLikedByUser, PublishBlog, trendingBlog, updateLike,
  getNotification, notification
} from "../Components/BlogController.js";

const blogRouter = express.Router();

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dziwn1wrk',
  api_key: process.env.CLOUDINARY_API_KEY || '493848339381675',
  api_secret: process.env.CLOUDINARY_API_SECRET || '0OI7gAWXqEet9MgLkgHE9-HMHxw',
});

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload blog banner to Cloudinary
// OLD: UserSchema.findOneAndUpdate() — NEW: supabase.from('profiles').update()
blogRouter.post("/upload-blog-banner/:userId", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Convert buffer to base64 and upload to Cloudinary
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinaryV2.uploader.upload(base64Image, {
      folder: "NSD/Blogs",
      timeout: 60000,
    });

    // Just return the URL — the blog editor stores it in the blog record itself
    // No need to update the user profile for a banner image
    res.status(200).json({
      message: "Blog banner uploaded successfully.",
      bannerImageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading blog banner:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

blogRouter.post("/createBlog", PublishBlog);
blogRouter.post("/createDraft", DraftBlog);
blogRouter.post("/getBlog", getBlog);
blogRouter.get("/trendingBlog", trendingBlog);
blogRouter.post("/isLikedUser", isLikedByUser);
blogRouter.post("/getBlogData", getBlogData);
blogRouter.post("/getCommentData", getCommentData);
blogRouter.post("/addComment", addComment);
blogRouter.post("/updateLike", updateLike);
blogRouter.post("/getSpecificTag", getSpecificTag);
blogRouter.post("/getNotification", getNotification);
blogRouter.post("/notifications", notification);

export default blogRouter;